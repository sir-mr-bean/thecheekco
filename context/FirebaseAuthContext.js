// FirebaseAuthContext.tsx
import React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../utils/firebaseConfig";
import nookies from "nookies";
const AuthContext = createContext();

const FirebaseAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function getUser(uid) {
    return db.collection("users").doc(uid).get();
    //return auth.getUser(uid);
  }

  function updateProfile(
    firstName,
    lastName,
    streetAddress,
    city,
    state,
    zip,
    email
  ) {
    return currentUser.updateProfile({
      firstName: firstName,
      lastName: lastName,
      streetAddress: streetAddress,
      city: city,
      state: state,
      zip: zip,
      email: email,
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      nookies.set(undefined, "token", "", { path: "/" });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const value = {
    currentUser,
    getUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  return useContext(AuthContext);
}

export default FirebaseAuthProvider;
