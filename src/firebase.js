import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAm656_rBRAMk6ULMWgyuvo1G2NIvI8xWg",
  authDomain: "actual-backend-app-ab42f.firebaseapp.com",
  projectId: "actual-backend-app-ab42f",
  storageBucket: "actual-backend-app-ab42f.firebasestorage.app",
  messagingSenderId: "1001572020783",
  appId: "1:1001572020783:web:14366dbe29f83cf1914cda",
  measurementId: "G-2HJ72Z32FT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
