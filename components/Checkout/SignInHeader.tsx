import { Disclosure } from "@headlessui/react";
import { signIn, SignInResponse, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BeatLoader } from "react-spinners";
import VerificationStep from "../Login/VerificationStep";

const SignInHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [email, setEmail] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
    } catch (err: any) {
      console.error(err?.message);
      alert(err?.message);
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
    } catch (err: any) {
      console.error(err?.message);
      alert(err?.message);
    }
  };

  const handleAccountLogin = async (e: any) => {
    e.preventDefault();
    setEmail(emailRef.current?.value as string);
    setLoggingIn(true);
    const res: unknown = await signIn("email", {
      email: emailRef.current?.value as string,
      redirect: false,
    });
    if ((res as SignInResponse)?.error) {
      if ((res as SignInResponse)?.url) {
        window.location.replace((res as SignInResponse)?.url as string);
      }
    } else {
      setShowVerificationStep(true);
    }
    setLoggingIn(false);
  };

  const onPasswordKeyPress = useCallback(
    async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        await handleAccountLogin(e);
      }
    },
    [handleAccountLogin]
  );

  return (
    <>
      {showVerificationStep ? (
        <>
          <VerificationStep email={email} page="checkout" />
        </>
      ) : (
        <>
          <h2 className="whitespace-nowrap text-sm">
            Already have an account?
          </h2>
          <div className="flex w-full flex-col">
            <Disclosure>
              {({ open }: any) => (
                <>
                  <Disclosure.Button
                    as="div"
                    className="flex items-center text-sm"
                  >
                    <h2
                      className={
                        open
                          ? `hidden`
                          : `flex w-full cursor-pointer items-center justify-center text-text-secondary`
                      }
                    >
                      Log In
                    </h2>
                  </Disclosure.Button>
                  <div>
                    <Disclosure.Panel as="div" className="flex w-full flex-col">
                      <div className="w-full">
                        <div className="w-full">
                          <p className="py-2 text-center text-sm font-medium">
                            Sign in with
                          </p>

                          <div>
                            <div className="mx-auto mt-1 grid max-w-xl grid-cols-2 gap-3">
                              <div>
                                <button
                                  onClick={() => handleFacebookLogin()}
                                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium shadow-sm shadow-text-secondary  hover:bg-gray-50 "
                                >
                                  <span className="sr-only">
                                    Sign in with Facebook
                                  </span>
                                  <AiOutlineFacebook
                                    size={22}
                                    color="#4267B2"
                                  />
                                </button>
                              </div>

                              <div>
                                <button
                                  onClick={() => handleGoogleLogin()}
                                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium shadow-sm shadow-text-secondary  hover:bg-gray-50"
                                >
                                  <span className="sr-only">
                                    Sign in with Google
                                  </span>
                                  <FcGoogle size={22} color="#1DA1F2" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="relative mx-auto mt-6 max-w-xl">
                            <div
                              className="absolute inset-0 flex items-center"
                              aria-hidden="true"
                            >
                              <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="bg-white px-2 text-text-primary">
                                or sign in with a one-time code
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-xl">
                          <form className="space-y-6 text-text-primary">
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
                                  onKeyPress={(e: any) => onPasswordKeyPress(e)}
                                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-text-primary shadow-sm shadow-text-secondary focus:border-text-primary focus:outline-none focus:ring-text-primary sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <button
                                onClick={handleAccountLogin}
                                type="button"
                                className="mx-auto flex w-fit justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium text-white shadow-sm shadow-text-secondary hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2       "
                              >
                                {loggingIn ? (
                                  <BeatLoader
                                    color="#602d0d"
                                    loading={loggingIn}
                                    size={8}
                                  />
                                ) : (
                                  <span className="text-sm">
                                    Send me a sign in link!
                                  </span>
                                )}
                              </button>
                            </div>
                            <div className="relative mt-6">
                              <div
                                className="absolute inset-0 flex items-center"
                                aria-hidden="true"
                              >
                                <div className="w-full border-t border-gray-300" />
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-text-primary">
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
      )}
    </>
  );
};

export default SignInHeader;
