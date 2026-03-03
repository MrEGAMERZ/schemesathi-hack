const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    simplifyScheme,
    generateFAQs,
    translateContent,
    chatbotResponse,
    explainLikeIAm15,
} = require('../services/geminiService');
const { db } = require('../firebase/firebaseAdmin');

// Helper to send validation errors
const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return false;
    }
    return true;
};

// POST /simplify
router.post(
    '/simplify',
    [body('description').notEmpty().withMessage('description is required')],
    async (req, res) => {
        if (!validate(req, res)) return;
        try {
            const simplified = await simplifyScheme(req.body.description);
            res.json({ success: true, data: simplified });
        } catch (err) {
            console.error('POST /simplify error:', err.message);
            res.status(500).json({ success: false, error: 'AI simplification failed' });
        }
    }
);

// POST /translate
router.post(
    '/translate',
    [
        body('content').notEmpty().withMessage('content is required'),
        body('language')
            .isIn(['Hindi', 'Kannada', 'Tamil', 'English'])
            .withMessage('language must be Hindi, Kannada, Tamil, or English'),
    ],
    async (req, res) => {
        if (!validate(req, res)) return;
        const { content, language } = req.body;

        if (language === 'English') {
            return res.json({ success: true, data: content }); // no-op
        }

        try {
            const translated = await translateContent(content, language);
            res.json({ success: true, data: translated });
        } catch (err) {
            console.error('POST /translate error:', err.message);
            res.status(500).json({ success: false, error: 'AI translation failed' });
        }
    }
);

// POST /generate-faq
router.post(
    '/generate-faq',
    [body('description').notEmpty().withMessage('description is required')],
    async (req, res) => {
        if (!validate(req, res)) return;
        try {
            const faqs = await generateFAQs(req.body.description);
            res.json({ success: true, data: faqs });
        } catch (err) {
            console.error('POST /generate-faq error:', err.message);
            res.status(500).json({ success: false, error: 'FAQ generation failed' });
        }
    }
);

// POST /chatbot — RAG-powered smart context
router.post(
    '/chatbot',
    [body('query').notEmpty().withMessage('query is required')],
    async (req, res) => {
        if (!validate(req, res)) return;
        const { query } = req.body;
        try {
            // Step 1: Fetch all schemes from Firestore
            const snapshot = await db.collection('schemes').get();
            const allSchemes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Step 2: Score each scheme by relevance to the query
            const queryLower = query.toLowerCase();
            const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);

            const scored = allSchemes.map(scheme => {
                let score = 0;
                const name = (scheme.name || '').toLowerCase();
                const category = (scheme.category || '').toLowerCase();
                const description = (scheme.description || '').toLowerCase();
                const keywords = (scheme.keywords || []).join(' ').toLowerCase();

                // Exact / partial name match = highest priority
                if (queryLower.includes(name.split(' ')[0]) || name.includes(queryLower)) score += 10;
                if (category && queryLower.includes(category)) score += 5;
                queryWords.forEach(word => {
                    if (name.includes(word)) score += 4;
                    if (keywords.includes(word)) score += 3;
                    if (description.includes(word)) score += 1;
                });
                return { ...scheme, _score: score };
            });

            // Step 3: Take top 3 most relevant schemes for full-detail context
            const topSchemes = scored
                .filter(s => s._score > 0)
                .sort((a, b) => b._score - a._score)
                .slice(0, 3);

            // Step 4: Build rich RAG context
            let richContext = '';

            if (topSchemes.length > 0) {
                richContext += '=== HIGHLY RELEVANT SCHEMES — Full Details ===\n';
                topSchemes.forEach(s => {
                    richContext += `
SCHEME: ${s.name}
Category: ${s.category} | State: ${s.state || 'All India'}
Summary: ${s.summary || ''}
Description: ${s.description || ''}
Eligibility:
  - Age: ${s.eligibility?.min_age || 0}–${s.eligibility?.max_age || 'any'} years
  - Gender: ${s.eligibility?.gender || 'any'}
  - Income Limit: ${s.eligibility?.income_limit ? '₹' + s.eligibility.income_limit : 'No limit'}
  - Occupation: ${s.eligibility?.occupation || 'any'}
Required Documents: ${(s.required_documents || []).join(', ') || 'Not specified'}
How to Apply: ${s.application_process || 'Visit official website'}
Official Link: ${s.official_link || 'Not available'}
---`;
                });
            }

            // Brief list of all schemes for discovery questions
            richContext += '\n\n=== ALL AVAILABLE SCHEMES — Brief List ===\n';
            allSchemes.forEach(s => {
                richContext += `- ${s.name} (${s.category}): ${(s.summary || s.description || '').substring(0, 100)}\n`;
            });

            const answer = await chatbotResponse(query, richContext);
            res.json({ success: true, data: answer });
        } catch (err) {
            console.error('POST /chatbot error:', err.message);
            res.status(500).json({ success: false, error: 'Chatbot response failed' });
        }
    }
);

// POST /explain-15
router.post(
    '/explain-15',
    [body('description').notEmpty().withMessage('description is required')],
    async (req, res) => {
        if (!validate(req, res)) return;
        try {
            const explanation = await explainLikeIAm15(req.body.description);
            res.json({ success: true, data: explanation });
        } catch (err) {
            console.error('POST /explain-15 error:', err.message);
            res.status(500).json({ success: false, error: 'Explain like I am 15 failed' });
        }
    }
);

module.exports = router;
