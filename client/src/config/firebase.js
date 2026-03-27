import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDr3ReSWzO7PiuQep38XNznITzPmoHqSM",
  authDomain: "rohit-academy16.firebaseapp.com",
  projectId: "rohit-academy16",
  storageBucket: "rohit-academy16.appspot.com",
  messagingSenderId: "541264278096",
  appId: "1:541264278096:web:6df00f6b8ffddd12d09755"
};

const app = initializeApp(firebaseConfig);

/* 🔥 MAIN */
export const auth = getAuth(app);