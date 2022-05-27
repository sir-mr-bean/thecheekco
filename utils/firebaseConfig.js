import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2FbxH9SrOZnlzKJG9fdN44n9BVjFi8q8",
  authDomain: "thecheekco.firebaseapp.com",
  projectId: "thecheekco",
  storageBucket: "thecheekco.appspot.com",
  messagingSenderId: "412025333575",
  appId: "1:412025333575:web:a89b9fbf0a0f98dd9d4e62",
  measurementId: "G-KVMG9Y0S82",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();

export default firebaseConfig;
