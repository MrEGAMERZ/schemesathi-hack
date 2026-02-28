const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../firebase/firebaseAdmin');

// POST /eligibility-check
router.post(
    '/',
    [
        body('schemeId').notEmpty().withMessage('schemeId is required'),
        body('age').isInt({ min: 0, max: 120 }).withMessage('Valid age required'),
        body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male/female/other'),
        body('income').isFloat({ min: 0 }).withMessage('Valid income required'),
        body('state').notEmpty().withMessage('State is required'),
        body('occupation').notEmpty().withMessage('Occupation is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { schemeId, age, gender, income, state, occupation } = req.body;

        try {
            const doc = await db.collection('schemes').doc(schemeId).get();
            if (!doc.exists) {
                return res.status(404).json({ success: false, error: 'Scheme not found' });
            }

            const scheme = { id: doc.id, ...doc.data() };
            const e = scheme.eligibility;
            const reasons = [];

            // Age check
            if (age < e.min_age) reasons.push(`Minimum age required is ${e.min_age} years (you are ${age}).`);
            if (e.max_age > 0 && age > e.max_age) reasons.push(`Maximum age allowed is ${e.max_age} years (you are ${age}).`);

            // Gender check
            if (e.gender !== 'any' && e.gender.toLowerCase() !== gender.toLowerCase()) {
                reasons.push(`This scheme is only for ${e.gender} applicants.`);
            }

            // Income check (0 = no limit)
            if (e.income_limit > 0 && income > e.income_limit) {
                reasons.push(`Annual income must be below ₹${e.income_limit.toLocaleString('en-IN')} (yours: ₹${income.toLocaleString('en-IN')}).`);
            }

            // State check
            if (e.state && e.state.toLowerCase() !== 'all' && e.state.toLowerCase() !== state.toLowerCase()) {
                reasons.push(`This scheme is available only in ${e.state} state.`);
            }

            // Occupation check
            if (e.occupation && e.occupation.toLowerCase() !== 'any' && !e.occupation.toLowerCase().includes(occupation.toLowerCase())) {
                reasons.push(`This scheme is for ${e.occupation} applicants.`);
            }

            const eligible = reasons.length === 0;

            res.json({
                success: true,
                data: {
                    eligible,
                    reason: eligible
                        ? `You meet all eligibility criteria for "${scheme.name}". You may apply!`
                        : `Not eligible: ${reasons.join(' ')}`,
                    required_documents: scheme.required_documents || [],
                    scheme_name: scheme.name,
                },
            });
        } catch (err) {
            console.error('POST /eligibility-check error:', err);
            res.status(500).json({ success: false, error: 'Eligibility check failed' });
        }
    }
);

module.exports = router;
