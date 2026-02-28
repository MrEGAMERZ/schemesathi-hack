const express = require('express');
const router = express.Router();
const { db } = require('../firebase/firebaseAdmin');

// GET /schemes?category=&search=
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let snapshot = db.collection('schemes');

        if (category && category !== 'All') {
            snapshot = snapshot.where('category', '==', category);
        }

        const docs = await snapshot.get();
        let schemes = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Client-side search filter (case-insensitive name/description match)
        if (search) {
            const q = search.toLowerCase();
            schemes = schemes.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q)
            );
        }

        res.json({ success: true, data: schemes });
    } catch (err) {
        console.error('GET /schemes error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch schemes' });
    }
});

// GET /schemes/:id
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('schemes').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Scheme not found' });
        }

        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (err) {
        console.error('GET /schemes/:id error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch scheme' });
    }
});

module.exports = router;
