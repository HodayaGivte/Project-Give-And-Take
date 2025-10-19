// Import Admin SDK
const admin = require("firebase-admin");

// Load the service account key
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "give-and-take-57b2f.appspot.com",
});

// Firebase services setup
const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage().bucket(); // משתנה לשימוש בשירותי האחסון

// Export Firebase services and admin
module.exports = { auth, firestore, storage, admin }; 





// // Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase/app") ;
// // import { getAnalytics } from "firebase/analytics";
// const { getAuth } = require('firebase/auth') ;
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// const { getFirestore } = require("firebase/firestore") ;

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBLOboCNVHThmZpgZE1ri0X5M4o2IyW3hI",
//   authDomain: "give-and-take-57b2f.firebaseapp.com",
//   projectId: "give-and-take-57b2f",
//   storageBucket: "give-and-take-57b2f.appspot.com",
//   messagingSenderId: "293105294459",
//   appId: "1:293105294459:web:8ac41fd6406174b777d6de",
//   measurementId: "G-LK9D4FYWGP"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const firestore = getFirestore(app);

// module.exports = { auth, firestore };