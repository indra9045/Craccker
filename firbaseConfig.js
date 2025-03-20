import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (using environment variables)
const firebaseConfig = {
  apiKey: "AIzaSyA-paCI_qVVSrBYo-C6c-WZdgyw0PFpsxQ",
  authDomain: "suchismita-indrajit-cracker.firebaseapp.com",
  projectId: "suchismita-indrajit-cracker",
  storageBucket: "suchismita-indrajit-cracker.firebasestorage.app",
  messagingSenderId: "563551652014",
  appId: "1:563551652014:web:926858dd7cd5912d13053f",
  measurementId: "G-7CKMS6F5BW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Get Firestore database and Authentication instances
export const auth = getAuth(app);
export const db = getFirestore(app);
