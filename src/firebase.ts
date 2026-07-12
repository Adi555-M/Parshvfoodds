import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMz1dchimS5dV3DCslIRXsarwnm794BoA",
  authDomain: "empirical-nation-ctgzl.firebaseapp.com",
  projectId: "empirical-nation-ctgzl",
  storageBucket: "empirical-nation-ctgzl.firebasestorage.app",
  messagingSenderId: "834852487117",
  appId: "1:834852487117:web:ccfb14505f379bc3800e84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID if provided, otherwise default
export const db = getFirestore(app, "ai-studio-remixfileinsight-f36a46a0-f11f-414e-8e88-bea201974312");

export { collection, doc, onSnapshot, setDoc };
