import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/* =====================================
   🔥 FIREBASE CONFIG (SINGLE SOURCE)
===================================== */
const firebaseConfig = {
  apiKey: "AIzaSyBw1LyyJrNdem3SrhmImnxvWfoM1UZpagI",
  authDomain: "rohit-academy2026.firebaseapp.com",
  projectId: "rohit-academy2026",
  storageBucket: "rohit-academy2026.firebasestorage.app",
  messagingSenderId: "498241904742",
  appId: "1:498241904742:web:81ba247bdf9090eb494da7",
};

/* =====================================
   🚀 INIT
===================================== */
const app = initializeApp(firebaseConfig);

/* 🔐 AUTH */
export const auth = getAuth(app);