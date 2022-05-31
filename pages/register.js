import { useState, useRef, useEffect } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { hash, compare } from "bcryptjs";
import {
  BsJustifyLeft,
  BsJustifyRight,
  BsPersonCheck,
  BsLock,
  BsLockFill,
  BsEnvelope,
} from "react-icons/bs";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";
import { auth, db } from "../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import BeatLoader from "react-spinners/BeatLoader";
import { useRouter } from "next/router";

const register = () => {
  const useraccount = useFirebaseAuth();
  const router = useRouter();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [missingFields, setMissingFields] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState();
  const [loading, setLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [user, setUser] = useState({
    name: "",
    password: {
      password: "",
      confirm: "",
    },
  });

  useEffect(() => {
    if (useraccount.user !== null) {
      console.log(useraccount);
      router.push("/profile");
    }
  }, [useraccount]);

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

  const handleRegister = async () => {
    setAlreadyRegistered(false);
    setPasswordTooShort(false);
    if (
      nameRef.current.value === "" &&
      emailRef.current.value === "" &&
      passRef.current.value === ""
    )
      return setMissingFields(true);
    try {
      if (passwordMatch) {
        const result = await registerWithEmailAndPassword(
          nameRef.current.value,
          emailRef.current.value,
          passRef.current.value
        );
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
      return user;
    } catch (err) {
      console.error(err);
      if (err.message.includes("email-already-in-use")) {
        setAlreadyRegistered(true);
      }
      if (err.message.includes("weak-password")) {
        setPasswordTooShort(true);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      console.log(user);
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      console.log(q);
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      const user = res.user;
      console.log(user);
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      console.log(q);
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "facebook",
          email: user.email,
        });
      }
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-around items-center text-text-primary">
      <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5 flex flex-col items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-text-primary">
            Register new account
          </h3>
        </div>

        <p className="text-sm font-medium py-3">Register with</p>

        <div className="mt-1 grid grid-cols-2 gap-3 w-full items-stretch">
          <button
            onClick={() => handleFacebookLogin()}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
          >
            <span className="sr-only">Sign in with Facebook</span>
            <AiOutlineFacebook size={22} color="#4267B2" />
          </button>

          <button
            onClick={() => handleGoogleLogin()}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
          >
            <span className="sr-only">Sign in with Google</span>
            <FcGoogle size={22} color="#1DA1F2" />
          </button>
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
        <form className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-text-secondary sm:pt-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Name/Business Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm sm:mt-0 sm:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsPersonCheck
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                ref={nameRef}
                type="text"
                required
                name="name"
                id="name"
                autoComplete="name"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
              />
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
                ref={emailRef}
                required
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
                ref={passRef}
                required
                onChange={(e) => handlePasswordInput(e)}
                type="password"
                name="password"
                id="password"
                value={user.password.password}
                autoComplete="new-password"
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
                  required
                  id="confirm-password"
                  value={user.password.confirm}
                  autoComplete="new-password"
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 pl-10"
                />
              </div>
              {passwordMatch === false &&
                (user.password.confirm !== "" ||
                  user.password.password !== "") && (
                  <span className="text-xs font-gothic text-red-600">
                    Passwords don't match!
                  </span>
                )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRegister}
            className="cursor-pointer flex items-center text-center justify-center grow-0 w-full bg-button border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            {loading ? (
              <BeatLoader color="#602d0d" loading={loading} size={8} />
            ) : (
              <>Register</>
            )}
          </button>
        </form>
        <div className="w-1/2 flex justify-center items-center text-center">
          {alreadyRegistered && (
            <span className="text-sm text-center font-gothic text-red-600">
              Email already exists! Click here to login, or click here to reset
              your password
            </span>
          )}
          {passwordTooShort && (
            <span className="text-sm text-center font-gothic text-red-600">
              This password is too short. Password must be at least 6 characters
              in length.
            </span>
          )}
        </div>
      </div>
      <div className="hidden sm:flex max-w-[40vw] items">
        <Image
          width={600}
          height={600}
          src="https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/Eco_map_04ac6529f3.gif?updated_at=2022-05-24T23:53:56.723Z"
        />
      </div>
    </div>
  );
};

export default register;
