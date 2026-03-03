const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../firebase/firebaseAdmin');
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

            const pendingScheme = {
                ...structuredData,
                source_url: url,
                screenshot_url: screenshot,
                status: 'pending',
                created_at: new Date().toISOString(),
            };

            const docRef = await db.collection('pending_schemes').add(pendingScheme);
            console.log(`[Admin Scraper] Saved to pending_schemes with id: ${docRef.id}`);

            res.json({
                success: true,
                data: { id: docRef.id, ...pendingScheme },
                message: 'Scheme scraped with Puppeteer + AI. Ready for review.',
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

        // Remove screenshot from live schemes (too large for regular queries)
        const { screenshot_url, ...cleanData } = data;

        await db.collection('schemes').doc(schemeId).set({
            ...cleanData,
            translations,
            verified: true,
            last_updated: new Date().toISOString().split('T')[0],
            status: 'approved',
        });

        await db.collection('pending_schemes').doc(id).delete();

        res.json({ success: true, message: 'Scheme approved, published & auto-translated.' });
    } catch (err) {
        console.error('[Admin Approve] Error:', err.message);
        res.status(500).json({ success: false, error: 'Approval failed', details: err.message });
    }
});

// ── POST /admin/reject/:id ────────────────────────────────────────────────────
router.post('/reject/:id', async (req, res) => {
    try {
        await db.collection('pending_schemes').doc(req.params.id).delete();
        res.json({ success: true, message: 'Scheme rejected and removed.' });
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
