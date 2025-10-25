// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyx2lVm0pwkeXH0c3nQ7R--rBeqR35cCk",
  authDomain: "torneio-laliga-2026.firebaseapp.com",
  databaseURL: "https://torneio-laliga-2026-default-rtdb.firebaseio.com",
  projectId: "torneio-laliga-2026",
  storageBucket: "torneio-laliga-2026.firebasestorage.app",
  messagingSenderId: "1012731638472",
  appId: "1:1012731638472:web:75c40927ce87bda1a5ebfd",
  measurementId: "G-RCQBGXXPBB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
