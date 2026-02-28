const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../firebase/firebaseAdmin');

// POST /recommend
router.post(
    '/',
    [
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

        const { age, gender, income, state, occupation } = req.body;

        try {
            const snapshot = await db.collection('schemes').get();
            const allSchemes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            const scored = allSchemes.map((scheme) => {
                const e = scheme.eligibility;
                let score = 0;
                const matchReasons = [];
                const missReasons = [];

                // Age
                const ageOk = age >= e.min_age && (e.max_age === 0 || age <= e.max_age);
                if (ageOk) { score += 25; matchReasons.push('age qualifies'); }
                else missReasons.push('age does not qualify');

                // Gender
                const genderOk = e.gender === 'any' || e.gender.toLowerCase() === gender.toLowerCase();
                if (genderOk) { score += 20; matchReasons.push(`open to ${gender}`); }
                else missReasons.push('gender mismatch');

                // Income
                const incomeOk = e.income_limit === 0 || income <= e.income_limit;
                if (incomeOk) { score += 25; matchReasons.push('income within limit'); }
                else missReasons.push('income exceeds limit');

                // State
                const stateOk = !e.state || e.state.toLowerCase() === 'all' || e.state.toLowerCase() === state.toLowerCase();
                if (stateOk) { score += 15; matchReasons.push('available in your state'); }
                else missReasons.push('not available in your state');

                // Occupation
                const occOk = !e.occupation || e.occupation.toLowerCase() === 'any' || e.occupation.toLowerCase().includes(occupation.toLowerCase());
                if (occOk) { score += 15; matchReasons.push(`suited for ${occupation}`); }
                else missReasons.push('occupation mismatch');

                const reason = matchReasons.length > 0
                    ? `Recommended because: ${matchReasons.join(', ')}.`
                    : 'Partial match based on available criteria.';

                return { ...scheme, score, reason };
            });

            // Filter schemes with score >= 50 (at least somewhat eligible), sort descending
            const recommended = scored
                .filter((s) => s.score >= 50)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            // If fewer than 3, fill with top scorers regardless of threshold
            if (recommended.length < 3) {
                const extras = scored
                    .filter((s) => !recommended.find((r) => r.id === s.id))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3 - recommended.length);
                recommended.push(...extras);
            }

            res.json({ success: true, data: recommended });
        } catch (err) {
            console.error('POST /recommend error:', err);
            res.status(500).json({ success: false, error: 'Recommendation failed' });
        }
    }
);

module.exports = router;
