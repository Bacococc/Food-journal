import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
import { getStorage } from "firebase/storage";


// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAXxbak9jN9mmnRC9JVL6J9nLMbOMTJjWw",
  authDomain: "food-journal-6536d.firebaseapp.com",
  projectId: "food-journal-6536d",
  storageBucket: "food-journal-6536d.firebasestorage.app",
  messagingSenderId: "866436310978",
  appId: "1:866436310978:web:93379a5a879c10cf03585b",
  measurementId: "G-KC2GLHGGSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
