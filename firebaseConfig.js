/**
 * Firebase Admin SDK configuration
 * 
 * This file initializes Firebase Admin SDK with your service account key
 * and exports the `admin` object to use in other parts of the backend.
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Firebase service account JSON

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<YOUR_FIREBASE_PROJECT_ID>.firebaseio.com" // Replace with your project URL
});

// Export admin to use in controllers, services, and middleware
module.exports = { admin };
