// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // Replace this object with your Firebase project config
// const firebaseConfig = {
//   apiKey: "AIzaSyAt0l5LQDFQdCBm29VsUPN_tnk2ltpDuRw",
//   authDomain: "fiorano-api-docs.firebaseapp.com",
//   projectId: "fiorano-api-docs",
//   storageBucket: "fiorano-api-docs.firebasestorage.app",
//   messagingSenderId: "817091742700",
//   appId: "1:817091742700:web:a66e5a7569bf4cbe3b0ec9",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// export const db = getFirestore(app);

// // Initialize Authentication
// export const auth = getAuth(app);



// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt0l5LQDFQdCBm29VsUPN_tnk2ltpDuRw",
  authDomain: "fiorano-api-docs.firebaseapp.com",
  projectId: "fiorano-api-docs",
  storageBucket: "fiorano-api-docs.firebasestorage.app",
  messagingSenderId: "817091742700",
  appId: "1:817091742700:web:a66e5a7569bf4cbe3b0ec9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);
