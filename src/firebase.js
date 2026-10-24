import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Required for database

const firebaseConfig = {
  apiKey: "enter your API key",
  authDomain: "actual-backend-app-ab42f.firebaseapp.com",
  projectId: "actual-backend-app-ab42f",
  storageBucket: "actual-backend-app-ab42f.firebasestorage.app",
  messagingSenderId: "1001572020783",
  appId: "1:1001572020783:web:14366dbe29f83cf1914cda",
  measurementId: "G-2HJ7Z32FT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 

export default app;