import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../../../public/images/logo.png";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";
import { signIn, getProviders, useSession } from "next-auth/react";
import Head from "next/head";
import { AppProviders } from "next-auth/providers";

const login = ({ providers }: { providers: AppProviders }) => {
  const { data: session, status } = useSession();

  const [incorrectCreds, setIncorrectCreds] = useState(false);
  const router = useRouter();
  const { query } = router;
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const returnUrl = router.query?.returnTo;

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

  const handleAccountLogin = async () => {
    setLoggingIn(true);
    await signIn("email", { email: emailRef.current?.value as string });
    setLoggingIn(false);
  };

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
        <div className="flex h-screen w-full justify-center items-center mx-auto  text-text-primary">
          <BeatLoader
            color="#602d0d"
            loading={status === String("loading")}
            size={20}
          />
        </div>
      ) : (
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
              {query?.error === "OAuthAccountNotLinked" && (
                <div className="w-full bg-text-primary text-white font-gothic text-center p-2 rounded-xl mt-2">
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
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
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
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="sr-only">Sign in with Google</span>
                            <FcGoogle size={22} color="#1DA1F2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-bg-tan">
                        or sign in with a magic link
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
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-text-primary        focus:border-text-primary       sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={handleAccountLogin}
                        type="button"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
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
