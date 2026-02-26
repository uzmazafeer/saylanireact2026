import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBBa5Fa9LTxnxWFzgXKlooQsKHLSlCJjqg",
  authDomain: "saylanihack2026.firebaseapp.com",
  projectId: "saylanihack2026",
  storageBucket: "saylanihack2026.firebasestorage.app",
  messagingSenderId: "835399617062",
  appId: "1:835399617062:web:fbfcf8ad91859ee0beb4e7",
  measurementId: "G-XB4C6BVGJ9",
  databaseUrl: "https://saylanihack2026-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

