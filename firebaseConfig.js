// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1NFS_ix1pJIXYmJJWQxJbvmKRdrxm6nA",
  authDomain: "shopbackend-e3945.firebaseapp.com",
  projectId: "shopbackend-e3945",
  storageBucket: "shopbackend-e3945.firebasestorage.app",
  messagingSenderId: "13518224326",
  appId: "1:13518224326:web:80dc9da16ee2e51b0250c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);
