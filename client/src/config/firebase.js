import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/* =====================================
   🔥 FIREBASE CONFIG (SINGLE SOURCE)
===================================== */
const firebaseConfig = {
  apiKey: "AIzaSyDr3ReSW7oZ7PiuQep38XNzmlTzPmoHqSM",
  authDomain: "rohit-academy16.firebaseapp.com",
  projectId: "rohit-academy16",
  storageBucket: "rohit-academy16.firebasestorage.app",
  messagingSenderId: "541264278096",
  appId: "1:541264278096:web:6df00f6b8ffddd12d09755",
};

/* =====================================
   🚀 INIT
===================================== */
const app = initializeApp(firebaseConfig);

/* 🔐 AUTH */
export const auth = getAuth(app);