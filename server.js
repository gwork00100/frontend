import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// -------------------- CONFIG --------------------
const stripe = new Stripe("YOUR_STRIPE_SECRET_KEY"); // <-- Replace with your Stripe secret

// -------------------- FIREBASE CONFIG --------------------
const firebaseConfig = {
  apiKey: "AIzaSyD1NFS_ix1pJIXYmJJWQxJbvmKRdrxm6nA",
  authDomain: "shopbackend-e3945.firebaseapp.com",
  projectId: "shopbackend-e3945",
  storageBucket: "shopbackend-e3945.appspot.com",
  messagingSenderId: "13518224326",
  appId: "1:13518224326:web:80dc9da16ee2e51b0250c7"
};

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// -------------------- EXPRESS SETUP --------------------
const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

// -------------------- STRIPE PAYMENT INTENTS --------------------

// Create PaymentIntent (manual capture)
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, userId, cartItems } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      capture_method: "manual" // authorize only
    });

    // Save order to Firestore
    await setDoc(doc(db, "orders", paymentIntent.id), {
      userId,
      items: cartItems,
      amount,
      status: "authorized",
      type: "card",
      createdAt: serverTimestamp()
    });

    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Capture Stripe PaymentIntent
app.post("/capture-payment", async (req, res) => {
  try {
    const { id } = req.body;
    const paymentIntent = await stripe.paymentIntents.capture(id);

    // Update Firestore
    await setDoc(doc(db, "orders", id), { status: "captured" }, { merge: true });

    res.json({ success: true, paymentIntent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel Stripe PaymentIntent
app.post("/cancel-payment", async (req, res) => {
  try {
    const { id } = req.body;
    const paymentIntent = await stripe.paymentIntents.cancel(id);

    // Update Firestore
    await setDoc(doc(db, "orders", id), { status: "cancelled" }, { merge: true });

    res.json({ success: true, paymentIntent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- CRYPTO WALLET PAYMENT --------------------
app.post("/create-crypto-order", async (req, res) => {
  try {
    const { wallet, amount, userId, cartItems } = req.body;

    // Simulate a crypto transaction ID
    const txId = "TX" + Math.floor(Math.random() * 1_000_000_000);

    // Save crypto order to Firestore
    await setDoc(doc(db, "orders", txId), {
      userId,
      wallet,
      items: cartItems,
      amount,
      status: "pending",
      type: "crypto",
      createdAt: serverTimestamp()
    });

    res.json({ success: true, txId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------- START SERVER --------------------
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
