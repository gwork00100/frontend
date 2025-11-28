// firebaseConfig.js

// -------------------- IMPORT FIREBASE SDKS --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// -------------------- FIREBASE CONFIG --------------------
// Use the exact config from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD1NFS_ix1pJIXYmJJWQxJbvmKRdrxm6nA",
  authDomain: "shopbackend-e3945.firebaseapp.com",
  projectId: "shopbackend-e3945",
  storageBucket: "shopbackend-e3945.appspot.com", // <-- FIXED
  messagingSenderId: "13518224326",
  appId: "1:13518224326:web:80dc9da16ee2e51b0250c7"
};

// -------------------- INITIALIZE FIREBASE APP --------------------
const app = initializeApp(firebaseConfig);

// -------------------- INITIALIZE FIRESTORE --------------------
export const db = getFirestore(app);

// -------------------- INITIALIZE AUTH --------------------
export const auth = getAuth(app);

// -------------------- DEFAULT EXPORT --------------------
export default app;
