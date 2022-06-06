import { useAuth } from "../../context/FirebaseAuthContext";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { query, getDocs, collection, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import UserInfo from "../../components/Profile/UserInfo";
import UserOrders from "../../components/Profile/UserOrders";
import UserDashboard from "../../components/Profile/UserDashboard";
import { UserState } from "../../context/User/userContext";
import { setUserObj } from "../../context/User/userReducer";

const profile = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { userObj, dispatch } = UserState();
  console.log(userObj);

  const [userShippingObj, setUserShippingObj] = useState({
    firstName: "",
    lastName: "",
    company: "",
    streetAddress: "",
    apartmentOrUnit: "",
    city: "",
    state: "",
    country: "Australia",
    postalCode: "",
    emailAddress: "",
    phoneNumber: "",
  });

  useEffect(() => {
    //   const fetchDocs = async () => {
    //     const q = query(
    //       collection(db, "users"),
    //       where("uid", "==", currentUser.uid)
    //     );
    //     const userDoc = getDocs(q);
    //     const user = await userDoc;
    //     console.log(user.docs[0].data());
    //     const userData = user.docs[0].data();

    //     setUserObj({
    //       firstName: userData.firstName,
    //       lastName: userData.lastName,
    //       company: userData.company,
    //       streetAddress: userData.streetAddress,
    //       apartmentOrUnit: userData.apartmentOrUnit,
    //       city: userData.city,
    //       state: userData.state,
    //       country: userData.country,
    //       postalCode: userData.postalCode,
    //       email: userData.email,
    //       phoneNumber: userData.phoneNumber,
    //     });
    //   };

    if (!currentUser) {
      console.log(currentUser);
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Tab.Group>
        <Tab.List className="max-h-max grid grid-cols-4 items-end border-b border-b-text-secondary text-text-primary font-gothic text-sm sm:text-xl mx-2 sm:mx-8 mt-5 mb-2 justify-between text-center h-11 md:h-16 md:w-2/3 md:mx-auto lg:whitespace-nowrap gap-1 md:gap-3">
          <Tab as={Fragment}>
            {({ selected }) => (
              <span
                className={
                  selected
                    ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full`
                    : `cursor-pointer`
                }
              >
                Dashboard
              </span>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <span
                className={
                  selected
                    ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full`
                    : `cursor-pointer`
                }
              >
                Account Details
              </span>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <span
                className={
                  selected
                    ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full`
                    : `cursor-pointer`
                }
              >
                Orders
              </span>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <span
                className={
                  selected
                    ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full`
                    : `cursor-pointer`
                }
              >
                Payment Methods
              </span>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <UserDashboard />
          </Tab.Panel>
          <Tab.Panel>
            <UserInfo userObj={userObj} dispatch={dispatch} />
          </Tab.Panel>
          <Tab.Panel>
            <UserOrders />
          </Tab.Panel>
          <Tab.Panel>
            <UserInfo userObj={userObj} setUserObj={setUserObj} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default profile;
