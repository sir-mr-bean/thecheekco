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
import {
  getCsrfToken,
  getSession,
  GetSessionParams,
  useSession,
} from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import { User } from "@prisma/client";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { Context } from "@/backend/context";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";

interface PageProps {
  session: Session;
  csrfToken: string;
}

const profile: NextPage<PageProps> = (props) => {
  const { data: session, status } = trpc.useQuery(["next-auth.getSession"], {
    suspense: true,
  });
  const { data } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });
  console.log(props);
  console.log("session is ", session);
  const router = useRouter();
  const currentUser = session?.user as User;

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
    if (status === String("unauthenticated")) {
      router.push("/login");
    }
  }, [status]);

  return (
    <>
      {status === String("loading") ? (
        <div className="flex h-screen w-full justify-center items-center mx-auto  text-text-primary">
          <BeatLoader
            color="#602d0d"
            loading={status === "loading"}
            size={20}
          />
        </div>
      ) : status === String("success") ? (
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
      ) : (
        <div className="flex h-screen w-full justify-center items-center mx-auto  text-text-primary">
          <BeatLoader
            color="#602d0d"
            loading={status === "loading"}
            size={20}
          />
        </div>
      )}
    </>
  );
};

export default profile;

interface Props {
  props: {
    session: Session;
    csrfToken: string;
  };
}
