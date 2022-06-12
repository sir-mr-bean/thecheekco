import { useContext, createContext, useReducer, useEffect } from "react";
import UserReducer from "./userReducer";
import { useAuth } from "../FirebaseAuthContext";

import { db } from "../../utils/firebaseConfig";
import { query, getDocs, collection, where } from "firebase/firestore";

const User = createContext();

export const UserContext = ({ children }) => {
  const [userObj, dispatch] = useReducer(UserReducer, emptyUser);
  const { currentUser } = useAuth();
  const emptyUser = {
    firstName: "",
    lastName: "",
    company: "",
    streetAddress: "",
    apartmentOrUnit: "",
    city: "",
    state: "",
    country: "Australia",
    postalCode: "",
    email: "",
    phoneNumber: "",
  };

  const fetchDocs = async (currentUser) => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", currentUser.uid)
    );
    const user = await getDocs(q);
    const userData = user.docs[0].data();
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company,
      streetAddress: userData.streetAddress,
      apartmentOrUnit: userData.apartmentOrUnit,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      postalCode: userData.postalCode,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
    };
  };

  useEffect(() => {
    console.log("fetching user");
    if (currentUser) {
      fetchDocs(currentUser).then((user) => {
        dispatch({
          type: "SET_USER",
          payload: user,
        });
      });
    }
  }, [currentUser?.uid]);

  return (
    <User.Provider value={{ userObj, dispatch }}>{children}</User.Provider>
  );
};
export const UserState = () => {
  return useContext(User);
};

export default UserContext;
