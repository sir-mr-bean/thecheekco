import { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { hash, compare } from "bcryptjs";
import {
  BsJustifyLeft,
  BsJustifyRight,
  BsPersonCheck,
  BsLock,
  BsLockFill,
  BsEnvelope,
  BsHouseDoor,
  BsMailbox,
  BsBuilding,
  BsFillPinMapFill,
} from "react-icons/bs";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const register = () => {
  const [passwordMatch, setPasswordMatch] = useState();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: {
      password: "",
      confirm: "",
    },
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postcode: "",
    },
  });

  const handleInput = (e) => {
    if (e.target.id === "first-name") {
      setUser((user) => ({
        ...user,
        firstName: e.target.value,
      }));
    }
    if (e.target.id === "last-name") {
      setUser((user) => ({
        ...user,
        lastName: e.target.value,
      }));
    }
    if (e.target.id === "username") {
      setUser((user) => ({
        ...user,
        username: e.target.value,
      }));
    }
  };

  const handlePasswordInput = async (e) => {
    if (e.target.id === "password") {
      setUser((user) => ({
        ...user,
        password: {
          ...user.password,
          password: e.target.value,
        },
      }));
      setTimeout(() => {
        if (
          user.password.confirm &&
          user.password.confirm != null &&
          user.password.confirm != undefined
        ) {
          if (user.password.confirm == e.target.value) {
            setPasswordMatch(true);
          }
          if (user.password.confirm != e.target.value) {
            setPasswordMatch(false);
          }
        }
      }, 1000);
    }
    if (e.target.id === "confirm-password") {
      setUser((user) => ({
        ...user,
        password: {
          ...user.password,
          confirm: e.target.value,
        },
      }));
      setTimeout(() => {
        if (user.password.password == e.target.value) {
          setPasswordMatch(true);
        }
        if (user.password.password != e.target.value) {
          setPasswordMatch(false);
        }
      }, 1000);
    }
  };

  return (
    <div className="flex justify-around items-center text-text-primary">
      <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
        <div>
          <h3 className="text-lg leading-6 font-medium text-text-primary">
            Register new account
          </h3>
        </div>
        <div>
          <p className="text-sm font-medium py-3 ">Register with</p>

          <div className="mt-1 grid grid-cols-3 gap-3">
            <div>
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <AiOutlineFacebook size={22} color="#4267B2" />
              </a>
            </div>

            <div>
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Instagram</span>

                <svg className="w-6 h-6 absolute top-0">
                  <radialGradient id="RG" r="150%" cx="30%" cy="107%">
                    <stop stopColor="#fdf497" offset="0" />
                    <stop stopColor="#fdf497" offset="0.05" />
                    <stop stopColor="#fd5949" offset="0.45" />
                    <stop stopColor="#d6249f" offset="0.6" />
                    <stop stopColor="#285AEB" offset="0.9" />
                  </radialGradient>
                </svg>

                <div id="IG">
                  <svg
                    className="w-6 h-6 IGsvg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    id="IG"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </a>
            </div>

            <div>
              <div
                onClick={() => handleGoogleLogin()}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
              >
                <span className="sr-only">Sign in with Google</span>
                <FcGoogle size={22} color="#1DA1F2" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bg-tan text-text-primary">
              Or continue with
            </span>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              First name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsJustifyLeft
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                onChange={(e) => handleInput(e)}
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                value={user.firstName}
                className=" block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Last name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsJustifyRight
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                onChange={(e) => handleInput(e)}
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                value={user.lastName}
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsPersonCheck
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                onChange={(e) => handleInput(e)}
                type="text"
                name="username"
                id="username"
                autoComplete="family-name"
                value={user.username}
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                onChange={(e) => handlePasswordInput(e)}
                type="password"
                name="password"
                id="password"
                value={user.password.password}
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Confirm Password
            </label>
            <div className="w-full sm:mt-0 sm:col-span-2">
              <div className="mt-1 relative rounded-md shadow-sm ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsLockFill
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  onChange={(e) => handlePasswordInput(e)}
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={user.password.confirm}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
                />
              </div>
              {passwordMatch === false && (
                <span className="text-xs font-gothic text-red-600">
                  Passwords don't match!
                </span>
              )}
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsEnvelope
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>
        </div>
        <div className="cursor-pointer flex items-center text-center justify-center w-full bg-button border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
          Register
        </div>
      </div>
      <Image
        width={450}
        height={450}
        src="https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/Eco_map_04ac6529f3.gif?updated_at=2022-05-24T23:53:56.723Z"
      ></Image>
    </div>
  );
};

export default register;
