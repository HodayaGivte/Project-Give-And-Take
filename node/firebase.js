
const admin = require("firebase-admin");

let auth, firestore, storage;

// במהלך בדיקות
if (process.env.NODE_ENV === "test") {
  // פשוט מחזירים mocks ריקים/פונקציות Jest
  auth = jest.fn();
  firestore = jest.fn();
  storage = jest.fn();
} else {
  // Load service account only when not testing
  const serviceAccount = require("./serviceAccountKey.json");

  // Initialize Firebase only if not initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "give-and-take-57b2f.appspot.com",
    });
  }

  auth = admin.auth();
  firestore = admin.firestore();
  storage = admin.storage().bucket();
}

module.exports = { auth, firestore, storage, admin };










// // Import Admin SDK
// const admin = require("firebase-admin");


// // Load service account ONLY when not testing
// let serviceAccount = null;
// if (process.env.NODE_ENV !== "test") {
//   serviceAccount = require("./serviceAccountKey.json");
// }

// // Initialize Firebase Admin only if not in test mode
// if (!admin.apps.length && process.env.NODE_ENV !== "test") {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "give-and-take-57b2f.appspot.com",
//   });
// } else if (!admin.apps.length) {
//   // During tests: initialize without real credentials
//   admin.initializeApp();
// }

// // Firebase services setup
// const auth = admin.auth();
// const firestore = admin.firestore();
// const storage = admin.storage().bucket(); // משתנה לשימוש בשירותי האחסון

// // Export Firebase services and admin
// module.exports = { auth, firestore, storage, admin }; 

