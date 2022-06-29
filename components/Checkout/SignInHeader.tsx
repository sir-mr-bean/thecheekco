import { Disclosure } from "@headlessui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BeatLoader } from "react-spinners";

const SignInHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [incorrectCreds, setIncorrectCreds] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signIn("facebook", {
        redirect: false,
      });
      if (session?.user) {
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // const handleAccountLogin = async () => {
  //   if (!emailRef.current || !passRef.current) return;
  //   setLoggingIn(true);
  //   try {
  //     const result = await logInWithEmailAndPassword(
  //       emailRef.current.value,
  //       passRef.current.value
  //     );

  //     setLoggingIn(false);
  //   } catch (error) {}
  // };

  // const logInWithEmailAndPassword = async (
  // //   email: string,
  // //   password: string
  // // ): Promise<> => {
  // //   let result;
  // //   try {
  // //     result = await signInWithEmailAndPassword(auth, email, password);
  // //   } catch (e) {
  // //     const result = (e as Error).message;
  // //     if (result.includes("invalid-email")) {
  // //       setIncorrectCreds(true);
  // //       setLoggingIn(false);
  // //     }
  // //     if (result.includes("wrong-password")) {
  // //       setIncorrectCreds(true);
  // //       setLoggingIn(false);
  // //     }
  // //   }
  // //   return result as UserCredential;
  // )

  return (
    <>
      <h2 className="text-sm whitespace-nowrap">Already have an account?</h2>
      <div className="flex flex-col w-full">
        <Disclosure>
          {({ open }: any) => (
            <>
              <Disclosure.Button as="div" className="flex text-sm items-center">
                <h2
                  className={
                    open
                      ? `hidden`
                      : `text-text-secondary cursor-pointer w-full flex justify-center items-center`
                  }
                >
                  Log In
                </h2>
              </Disclosure.Button>
              <div>
                <Disclosure.Panel as="div" className="w-full flex flex-col">
                  <div className="w-full">
                    <div className="w-full">
                      <p className="text-sm font-medium text-center py-2">
                        Sign in with
                      </p>

                      <div>
                        <div className="mt-1 grid grid-cols-2 gap-3 max-w-xl mx-auto">
                          <div>
                            <button
                              onClick={() => handleFacebookLogin()}
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm shadow-text-secondary bg-white text-sm font-medium  hover:bg-gray-50 "
                            >
                              <span className="sr-only">
                                Sign in with Facebook
                              </span>
                              <AiOutlineFacebook size={22} color="#4267B2" />
                            </button>
                          </div>

                          <div>
                            <button
                              onClick={() => handleGoogleLogin()}
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm shadow-text-secondary bg-white text-sm font-medium  hover:bg-gray-50"
                            >
                              <span className="sr-only">
                                Sign in with Google
                              </span>
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
                          <span className="px-2 bg-white text-text-primary">
                            Or
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 ">
                      <form
                        action="#"
                        method="POST"
                        className="space-y-6 text-text-primary"
                      >
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium "
                          >
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
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm shadow-text-secondary placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
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
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm shadow-text-secondary placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
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
                              className="ml-2 block text-sm"
                            >
                              Remember me
                            </label>
                          </div>

                          <div className="">
                            <a
                              href="#"
                              className="text-sm text-text-primary hover:text-text-primary"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </div>

                        <div>
                          <button
                            //onClick={handleAccountLogin}
                            type="button"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary       "
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
                        <div className="mt-6 relative">
                          <div
                            className="absolute inset-0 flex items-center"
                            aria-hidden="true"
                          >
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-text-primary">
                              Or continue as guest
                            </span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};

export default SignInHeader;
