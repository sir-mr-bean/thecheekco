import { useAuth } from "../../../context/FirebaseAuthContext";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import UserInfo from "../../../components/Profile/UserInfo";
import UserOrders from "../../../components/Profile/UserOrders";
import UserDashboard from "../../../components/Profile/UserDashboard";
import { UserState } from "../../../context/User/userContext";
import { setUserObj } from "../../../context/User/userReducer";
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { Context } from "@/backend/context";
import { trpc } from "@/utils/trpc";

const profile: NextPage = () => {
  const query = trpc.useQuery(["next-auth.getSession"], { suspense: true });
  //console.log(query);
  //console.log(props);
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUser = session?.user as User;
  //const { currentUser } = useAuth();
  //const { userObj, dispatch } = UserState();
  //console.log(userObj);
  //console.log(currentUser);
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

  // useEffect(() => {
  //   if (status !== "authenticated" && status !== "loading") {
  //     if (currentUser === null || currentUser === undefined) {
  //       router.push("/login");
  //     }
  //   }
  // }, [currentUser, status]);

  return (
    <>
      {status === "loading" ? (
        <div className="flex h-screen w-full justify-center items-center mx-auto  text-text-primary">
          <BeatLoader
            color="#602d0d"
            loading={status === "loading"}
            size={20}
          />
        </div>
      ) : (
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
              <UserInfo />
            </Tab.Panel>
            <Tab.Panel>
              <UserOrders />
            </Tab.Panel>
            <Tab.Panel>
              <UserInfo />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
};

export default profile;

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       session: await getSession(context),
//     },
//   };
// }
