console.log("AI Chat Loaded");

import { db, auth } from './firebaseConfig.js';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
    const chatBtn = document.getElementById("aiChatButton");
    const chatWindow = document.getElementById("aiChatWindow");

    if (!chatBtn || !chatWindow) {
        console.error("Chat elements not found");
        return;
    }

    // Button style
    Object.assign(chatBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#007bff",
        color: "white",
        padding: "15px",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "22px",
        zIndex: "999999"
    });

    // Chat window style
    Object.assign(chatWindow.style, {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "320px",
        height: "420px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "10px",
        display: "none",
        flexDirection: "column",
        zIndex: "999999"
    });

    chatWindow.innerHTML = `
        <div style="background:#007bff; color:white; padding:10px; border-radius:10px 10px 0 0; text-align:center;">
            PrimeShift AI
        </div>
        <div id="aiMessages" style="flex:1; padding:10px; overflow-y:auto; height:300px;"></div>
        <input id="aiInput" type="text" placeholder="Ask me anything..." style="padding:10px; border:none; width:100%; box-sizing:border-box;">
    `;

    const messagesBox = document.getElementById("aiMessages");
    const inputBox = document.getElementById("aiInput");

    chatBtn.addEventListener("click", () => {
        chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
    });

    inputBox.addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && inputBox.value.trim()) {
            const msg = inputBox.value.trim();
            inputBox.value = "";
            messagesBox.innerHTML += `<div><b>You:</b> ${msg}</div>`;
            messagesBox.scrollTop = messagesBox.scrollHeight;

            await addDoc(collection(db, "ai_chat"), {
                user: auth.currentUser ? auth.currentUser.uid : "guest",
                message: msg,
                from: "user",
                timestamp: serverTimestamp()
            });
        }
    });

    const chatQuery = query(collection(db, "ai_chat"), orderBy("timestamp"));
    onSnapshot(chatQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            if (data.from === "ai") {
                messagesBox.innerHTML += `<div><b>AI:</b> ${data.message}</div>`;
                messagesBox.scrollTop = messagesBox.scrollHeight;
            }
        });
    });
});
