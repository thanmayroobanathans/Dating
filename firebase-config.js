// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl6N-UJoIAIxnDEcRBJflC8XeJ5vzMTIU",
  authDomain: "dating-a61de.firebaseapp.com",
  projectId: "dating-a61de",
  storageBucket: "dating-a61de.firebasestorage.app",
  messagingSenderId: "1017503330229",
  appId: "1:1017503330229:web:0551a48b04d8b628c4f3fc",
  measurementId: "G-3D4D3X4KS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
