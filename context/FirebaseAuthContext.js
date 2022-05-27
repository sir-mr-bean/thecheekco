// FirebaseAuthContext.tsx
import React from "react";
import firebase from "firebase/app";
import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../utils/firebaseConfig";

const FirebaseAuthContext = createContext();

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = { user };

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    console.log("user is ", value);
  }, []);

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  return context?.user;
}

export default FirebaseAuthProvider;
