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
    <div className="flex justify-center items-center text-text-primary">
      <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Register new account
          </h3>
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

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="street-address"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Street address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsHouseDoor
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              City
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsBuilding
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="city"
                id="city"
                autoComplete="address-level2"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              State
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsFillPinMapFill
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="region"
                id="region"
                autoComplete="address-level1"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Postcode
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsMailbox
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="postal-code"
                id="postal-code"
                autoComplete="address-level1"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
            </div>
          </div>
        </div>
        <div className="cursor-pointer flex items-center text-center justify-center w-full bg-button border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
          Register
        </div>
      </div>
    </div>
  );
};

export default register;
