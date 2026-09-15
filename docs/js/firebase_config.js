/**
 * WorkMate Google Firebase Cloud Database Configuration
 * Project: Work Mate (work-mate-eadb9)
 * Official Cloud Firestore & Real-Time Sync Engine
 */

const firebaseConfig = {
  apiKey: "AIzaSyBeABF-ZX3db3x0Kd3cnc5MJbkKLiDRI5s",
  authDomain: "work-mate-eadb9.firebaseapp.com",
  projectId: "work-mate-eadb9",
  storageBucket: "work-mate-eadb9.firebasestorage.app",
  messagingSenderId: "1864654661673",
  appId: "1:1864654661673:web:b49842b0b70abf859e9438",
  measurementId: "G-Y5QY4NJH19"
};

// Initialize Firebase
let firebaseApp = null;
let firestoreDb = null;
let isFirebaseOnline = false;

try {
  if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firestoreDb = firebase.firestore();
    isFirebaseOnline = true;
    console.log("[Firebase] Successfully initialized WorkMate Cloud Firestore (work-mate-eadb9)!");
  } else if (typeof firebase !== "undefined" && firebase.apps.length) {
    firebaseApp = firebase.app();
    firestoreDb = firebase.firestore();
    isFirebaseOnline = true;
  }
} catch (err) {
  console.warn("[Firebase] Client initialization notice:", err);
}

// Global accessor
window.workmateFirebase = {
  config: firebaseConfig,
  app: firebaseApp,
  getDb: () => firestoreDb,
  isOnline: () => isFirebaseOnline
};
