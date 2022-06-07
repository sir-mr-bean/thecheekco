import { useRef, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../utils/firebaseConfig";
import { useAuth } from "../../context/FirebaseAuthContext";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";

const login = () => {
  const { currentUser } = useAuth();
  const [incorrectCreds, setIncorrectCreds] = useState(false);
  const router = useRouter();
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (currentUser !== null) {
      console.log(currentUser);
      router.push("/profile");
    }
  }, [currentUser]);

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res?.user;
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
      const user = res?.user;
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

  const handleAccountLogin = async () => {
    setLoggingIn(true);
    try {
      const result = await logInWithEmailAndPassword(
        emailRef.current.value,
        passRef.current.value
      );
      console.log(result);
      setLoggingIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result?.user;
      console.log(user);
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "local",
          email: user.email,
        });
      }
      return result;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("invalid-email")) {
        setIncorrectCreds(true);
        setLoggingIn(false);
      }
      if (err.message.includes("wrong-password")) {
        setIncorrectCreds(true);
        setLoggingIn(false);
      }
    }
  };

  return (
    <div className="min-h-full flex text-text-primary">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col justify-center items-center">
            <Image
              height={147.5}
              width={147.5}
              className=""
              src={Logo}
              alt="Workflow"
            />
            <h2 className="mt-6 text-3xl font-extrabold ">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <p className="text-sm font-medium ">Sign in with</p>

                <div className="mt-1 grid grid-cols-2 gap-3">
                  <div>
                    <button
                      onClick={() => handleFacebookLogin()}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="sr-only">Sign in with Facebook</span>
                      <AiOutlineFacebook size={22} color="#4267B2" />
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => handleGoogleLogin()}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="sr-only">Sign in with Google</span>
                      <FcGoogle size={22} color="#1DA1F2" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-bg-tan">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium ">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-text-primary        focus:border-text-primary       sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium "
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      ref={passRef}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-text-primary        focus:border-text-primary       sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-text-primary focus:ring-text-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm "
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-text-primary hover:text-text-secondary"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleAccountLogin}
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary       "
                  >
                    {loggingIn ? (
                      <BeatLoader
                        color="#602d0d"
                        loading={loggingIn}
                        size={8}
                      />
                    ) : (
                      <>Sign In</>
                    )}
                  </button>
                </div>
              </form>
              <div className="w-1/2 flex justify-center items-center text-center mx-auto pt-2">
                {incorrectCreds && (
                  <span className="text-sm text-center font-gothic text-red-600 ">
                    Incorrect Username or Password. Please try again.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 mt-10 ">
        <Image
          layout="fill"
          className="absolute inset-0 h-full w-full object-cover rounded-sm"
          src="https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/theladyagave_5bad4bd4c2.jpeg"
          alt=""
        />
      </div>
    </div>
  );
};

export default login;
