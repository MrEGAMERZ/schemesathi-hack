const admin = require('firebase-admin');

const initFirebase = () => {
    try {
        let serviceAccount;

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Render / production: stored as JSON string in env var
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            // Local dev: load from file
            serviceAccount = require('./serviceAccountKey.json');
        }

        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: `${serviceAccount.project_id}.appspot.com`
            });
            console.log('✅ Firebase Admin SDK initialized');
        }

        return {
            db: admin.firestore(),
            bucket: admin.storage().bucket()
        };
    } catch (err) {
        console.error('❌ Firebase initialization failed:', err.message);
        throw err;
    }
};

const { db, bucket } = initFirebase();

module.exports = { db, admin, bucket };
