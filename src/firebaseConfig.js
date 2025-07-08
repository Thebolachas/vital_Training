// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxG31iFH8RUH8DNpc_pR6yAOSRgWFX_Bs", // <-- Suas chaves Firebase
  authDomain: "vitaltraining-87ed4.firebaseapp.com",
  projectId: "vitaltraining-87ed4",
  storageBucket: "vitaltraining-87ed4.firebasestorage.app",
  messagingSenderId: "412617217857",
  appId: "1:412617217857:web:962149d0a6b572ea0a33c0",
  measurementId: "G-YVLN7Z4GZ4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);