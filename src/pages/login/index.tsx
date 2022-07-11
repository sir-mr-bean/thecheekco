import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Logo from "../../../public/images/logo.png";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";
import {
  signIn,
  getProviders,
  useSession,
  SignInResponse,
} from "next-auth/react";
import Login from "../../../public/images/Login/login.png";
import Head from "next/head";
import { AppProviders } from "next-auth/providers";

import VerificationStep from "@/components/Login/VerificationStep";

const login = ({ providers }: { providers: AppProviders }) => {
  const { data: session, status } = useSession();
  const [incorrectCreds, setIncorrectCreds] = useState(false);
  const router = useRouter();
  const { query } = router;
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");

  const [loggingIn, setLoggingIn] = useState(false);
  const returnUrl = router.query?.returnTo;
  const error = router.query?.error?.includes("Verification");

  useEffect(() => {
    if (status === String("authenticated")) {
      if (returnUrl) {
        router.push(router.basePath + returnUrl);
      } else {
        router.push("/profile");
      }
    }
  }, [status]);

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        redirect: false,
      });
      if (session?.user) {
        router.push("/profile");
      }
    } catch (err: any) {
      if (err) console.error(err);
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
      console.error(err);
      alert(err.message);
    }
  };

  const handleAccountLogin = async (e: any) => {
    setEmail(emailRef.current?.value as string);
    e.preventDefault();
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
      <Head>
        <title>The Cheek Co. - Login</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === String("loading") || status === "authenticated" ? (
        <div className="mx-auto flex h-screen w-full items-center justify-center text-text-primary">
          <BeatLoader
            color="#602d0d"
            loading={status === String("loading")}
            size={20}
          />
        </div>
      ) : showVerificationStep ? (
        <>
          <VerificationStep email={email} page="login" />
        </>
      ) : (
        <div className="flex min-h-full text-text-primary">
          <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            {error && (
              <span className="mb-12 w-fit rounded-xl bg-text-secondary px-3 py-2 text-center text-lg text-white sm:mt-6 sm:mb-24 sm:px-20">
                The entered token was incorrect, expired or has already been
                used. Please try again.
              </span>
            )}
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="flex flex-col items-center justify-center">
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
              {query?.error === "OAuthAccountNotLinked" && (
                <div className="mt-2 w-full rounded-xl bg-text-primary p-2 text-center font-gothic text-white">
                  To confirm your identity, please sign in with the same account
                  you used originally.
                </div>
              )}
              <div className="mt-8">
                <div>
                  {providers && (
                    <div>
                      <p className="text-sm font-medium ">Sign in with</p>

                      <div className="mt-1 grid grid-cols-2 gap-3">
                        <div>
                          <button
                            onClick={() => handleFacebookLogin()}
                            className="inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium  shadow-sm hover:bg-gray-50"
                          >
                            <span className="sr-only">
                              Sign in with Facebook
                            </span>
                            <AiOutlineFacebook size={22} color="#4267B2" />
                          </button>
                        </div>

                        <div>
                          <button
                            onClick={handleGoogleLogin}
                            className="inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium  shadow-sm hover:bg-gray-50"
                          >
                            <span className="sr-only">Sign in with Google</span>
                            <FcGoogle size={22} color="#1DA1F2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative mt-6">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-bg-tan px-2">
                        or sign in with a one-time code
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <form className="space-y-6">
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
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-text-primary focus:outline-none        focus:ring-text-primary sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={handleAccountLogin}
                        type="button"
                        className="flex w-full justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium text-white shadow-sm hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
                      >
                        {loggingIn ? (
                          <BeatLoader
                            color="#602d0d"
                            loading={loggingIn}
                            size={8}
                          />
                        ) : (
                          <span className="text-sm">
                            Send me a verification code!
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                  <div className="mx-auto flex w-1/2 items-center justify-center pt-2 text-center">
                    {incorrectCreds && (
                      <span className="text-center font-gothic text-sm text-red-600 ">
                        Incorrect Username or Password. Please try again.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-10 hidden w-0 flex-1 lg:block ">
            <Image
              layout="fill"
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
              src={Login}
              priority
              alt="Login to The Cheek Co."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default login;

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
