const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    simplifyScheme,
    generateFAQs,
    translateContent,
    chatbotResponse,
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

// POST /chatbot
router.post(
    '/chatbot',
    [body('query').notEmpty().withMessage('query is required')],
    async (req, res) => {
        if (!validate(req, res)) return;
        try {
            // Fetch a brief summary of all schemes for context
            const snapshot = await db.collection('schemes').get();
            const schemesSummary = snapshot.docs
                .map((doc) => {
                    const d = doc.data();
                    return `- ${d.name} (${d.category}): ${d.description.substring(0, 120)}...`;
                })
                .join('\n');

            const answer = await chatbotResponse(req.body.query, schemesSummary);
            res.json({ success: true, data: answer });
        } catch (err) {
            console.error('POST /chatbot error:', err.message);
            res.status(500).json({ success: false, error: 'Chatbot response failed' });
        }
    }
);

module.exports = router;
