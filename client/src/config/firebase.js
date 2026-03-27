import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDr3ReSW7oZ7PiuQep38XNzmlTzPmoHqSM",
  authDomain: "rohit-academy16.firebaseapp.com",
  projectId: "rohit-academy16",
  storageBucket: "rohit-academy16.firebasestorage.app",
  messagingSenderId: "541264278096",
  appId: "1:541264278096:web:e031133fc0e7bfb1d09755",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);