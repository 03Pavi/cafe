import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
  projectId: process.env.FIREBASE_PROJECT_ID || "brew-haven-mock",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "mock-storage-bucket",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: process.env.FIREBASE_APP_ID || "mock-app-id",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
