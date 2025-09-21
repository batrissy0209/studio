// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA61Sr0jzDrGbl6BGn89RmWVmbFd9csPB8",
  authDomain: "studio-717135246-44200.firebaseapp.com",
  projectId: "studio-717135246-44200",
  storageBucket: "studio-717135246-44200.appspot.com",
  messagingSenderId: "450512461738",
  appId: "1:450512461738:web:55b637280a4671118a15d3",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
