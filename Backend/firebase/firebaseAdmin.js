const admin = require('firebase-admin');

let db;

const initFirebase = () => {
    if (admin.apps.length > 0) return admin.firestore();

    try {
        let serviceAccount;

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Render / production: stored as JSON string in env var
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            // Local dev: load from file
            serviceAccount = require('./serviceAccountKey.json');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('✅ Firebase Admin SDK initialized');
        return admin.firestore();
    } catch (err) {
        console.error('❌ Firebase initialization failed:', err.message);
        throw err;
    }
};

db = initFirebase();

module.exports = { db, admin };
