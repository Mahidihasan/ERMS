// firebase-config.js
// Firebase configuration and initialization

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-GM8xEZFZf3A0KtBGPEwuUPYNoiK4s9w",

  authDomain: "emergency-response-bd.firebaseapp.com",

  projectId: "emergency-response-bd",

  storageBucket: "emergency-response-bd.firebasestorage.app",

  messagingSenderId: "732526452496",

  appId: "1:732526452496:web:d00c2fedd2acb189158f95"

};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Firebase analytics (optional)
// const analytics = firebase.analytics();

// Enable offline persistence
db.enablePersistence()
  .catch((err) => {
      console.log("Firebase persistence failed: ", err);
  });

// Export for global access
window.firebaseApp = app;
window.auth = auth;
window.db = db;
window.firestore = db;
window.storage = storage;

console.log("Firebase initialized successfully");