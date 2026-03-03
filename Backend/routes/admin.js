const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db, bucket } = require('../firebase/firebaseAdmin');
const { extractSchemeData, translateContent } = require('../services/geminiService');
const { scrapeWithPuppeteer } = require('../services/scraperService');

// ── Auth Middleware ───────────────────────────────────────────────────────────
const adminAuth = (req, res, next) => {
    const adminPass = process.env.ADMIN_PASSWORD || 'sh-admin-2025';
    const authHeader = req.headers['x-admin-password'];
    if (authHeader === adminPass) {
        next();
    } else {
        res.status(401).json({ success: false, error: 'Unauthorized: Admin access required' });
    }
};

router.use(adminAuth);

// ── Validation helper ─────────────────────────────────────────────────────────
const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return false;
    }
    return true;
};

// ── POST /admin/scrape ────────────────────────────────────────────────────────
// Puppeteer-based scraper → AI structuring → pending_schemes
router.post(
    '/scrape',
    [body('url').isURL().withMessage('Valid URL is required')],
    async (req, res) => {
        if (!validate(req, res)) return;
        const { url } = req.body;

        try {
            console.log(`[Admin Scraper] Launching Puppeteer for: ${url}`);
            const { text, screenshot } = await scrapeWithPuppeteer(url);

            console.log(`[Admin Scraper] Text extracted (${text.length} chars). Running Gemini extraction...`);
            const structuredData = await extractSchemeData(text.substring(0, 15000));

            // -- NEW: Upload screenshot to Firebase Storage --
            let screenshotUrl = null;
            if (screenshot) {
                const fileName = `screenshots/${Date.now()}_scraped.png`;
                const file = bucket.file(fileName);
                const buffer = Buffer.from(screenshot.split(',')[1], 'base64');

                await file.save(buffer, { contentType: 'image/png' });
                await file.makePublic();
                screenshotUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                console.log(`[Admin Scraper] Screenshot uploaded: ${screenshotUrl}`);
            }

            const pendingScheme = {
                ...structuredData,
                source_url: url,
                screenshot_url: screenshotUrl,
                status: 'pending',
                created_at: new Date().toISOString(),
            };

            const docRef = await db.collection('pending_schemes').add(pendingScheme);
            console.log(`[Admin Scraper] Saved to pending_schemes with id: ${docRef.id}`);

            res.json({
                success: true,
                data: { id: docRef.id, ...pendingScheme },
                message: 'Scheme scraped and stored (Media in Cloud Storage).',
            });
        } catch (err) {
            console.error('[Admin Scraper] Error:', err.message);
            res.status(500).json({ success: false, error: 'Scraping or AI extraction failed', details: err.message });
        }
    }
);

// ── GET /admin/pending ────────────────────────────────────────────────────────
router.get('/pending', async (req, res) => {
    try {
        const snapshot = await db.collection('pending_schemes').orderBy('created_at', 'desc').get();
        const pending = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: pending });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch pending schemes' });
    }
});

// ── POST /admin/approve/:id ───────────────────────────────────────────────────
// Approve → moves to `schemes`, auto-generates Hindi/Tamil translations
router.post('/approve/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await db.collection('pending_schemes').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Pending scheme not found' });
        }

        const data = doc.data();
        const schemeId = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);

        // Auto-translate the summary for key languages
        console.log(`[Admin Approve] Generating translations for "${data.name}"...`);
        const textToTranslate = data.summary || data.description?.substring(0, 300) || '';

        let translations = {};
        try {
            const [hindi, tamil, kannada] = await Promise.all([
                translateContent(textToTranslate, 'Hindi'),
                translateContent(textToTranslate, 'Tamil'),
                translateContent(textToTranslate, 'Kannada'),
            ]);
            translations = { hi: hindi, ta: tamil, kn: kannada };
            console.log('[Admin Approve] Translations generated.');
        } catch (tErr) {
            console.warn('[Admin Approve] Translation failed (non-fatal):', tErr.message);
        }

        // -- NEW: Delete screenshot from storage if it exists --
        const { screenshot_url, ...cleanData } = data;
        if (screenshot_url) {
            try {
                const fileName = screenshot_url.split(`${bucket.name}/`)[1];
                if (fileName) await bucket.file(fileName).delete();
                console.log(`[Admin Approve] Deleted storage asset: ${fileName}`);
            } catch (sErr) {
                console.warn('[Admin Approve] Storage cleanup failed:', sErr.message);
            }
        }

        await db.collection('schemes').doc(schemeId).set({
            ...cleanData,
            translations,
            verified: true,
            last_updated: new Date().toISOString().split('T')[0],
            status: 'approved',
        });

        await db.collection('pending_schemes').doc(id).delete();

        res.json({ success: true, message: 'Scheme approved and storage cleaned up.' });
    } catch (err) {
        console.error('[Admin Approve] Error:', err.message);
        res.status(500).json({ success: false, error: 'Approval failed', details: err.message });
    }
});

// ── POST /admin/reject/:id ────────────────────────────────────────────────────
router.post('/reject/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await db.collection('pending_schemes').doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            if (data.screenshot_url) {
                try {
                    const fileName = data.screenshot_url.split(`${bucket.name}/`)[1];
                    if (fileName) await bucket.file(fileName).delete();
                } catch (sErr) {
                    console.warn('[Admin Reject] Storage cleanup failed:', sErr.message);
                }
            }
        }
        await db.collection('pending_schemes').doc(id).delete();
        res.json({ success: true, message: 'Scheme rejected and storage purged.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Rejection failed' });
    }
});

// ── GET /admin/stats ──────────────────────────────────────────────────────────
// Returns quick stats: total schemes, pending count
router.get('/stats', async (req, res) => {
    try {
        const [schemesSnap, pendingSnap] = await Promise.all([
            db.collection('schemes').count().get(),
            db.collection('pending_schemes').count().get(),
        ]);
        res.json({
            success: true,
            data: {
                total_published: schemesSnap.data().count,
                total_pending: pendingSnap.data().count,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Stats fetch failed' });
    }
});

module.exports = router;
