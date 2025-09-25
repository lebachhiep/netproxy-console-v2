import { initializeApp } from 'firebase/app';
import {
  getAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC48jvqjNbD7sgx9LutCz_0ZPPSmGeQG_k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "netproxy-21b47.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "netproxy-21b47",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "netproxy-21b47.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "988854149248",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:988854149248:web:2335da22bfa2e41a328665",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2529QZ7E7P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set auth persistence based on "Remember me" option
export const setAuthPersistence = async (rememberMe: boolean) => {
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
};