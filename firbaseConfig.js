// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYBGb_Rs-pJj6LTh4ZBTMEq5al1CZXCFc",
  authDomain: "crack-7589a.firebaseapp.com",
  projectId: "crack-7589a",
  storageBucket: "crack-7589a.firebasestorage.app",
  messagingSenderId: "58574646600",
  appId: "1:58574646600:web:30254c1618830f0cb8177d",
  measurementId: "G-JW41LS08CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
// Get Firestore database and Authentication instances
export const auth = getAuth(app);
export const db = getFirestore(app);
