import { useState } from "react";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import validator from "validator";
import { useForm } from "react-hook-form";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const contactus = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [missingNameError, setMissingNameError] = useState(false);
  const [missingLastNameError, setMissingLastNameError] = useState(false);
  const [missingEmailError, setMissingEmailError] = useState(false);
  const [missingPhoneError, setMissingPhoneError] = useState(false);
  const [missingMessageError, setMissingMessageError] = useState(false);
  const [missingAgreeError, setMissingAgreeError] = useState(false);

  const handleFormSubmit = async (d) => {
    console.log(d);
    const { firstName, lastName, company, email, phoneNumber, message } = d;

    const body = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      company: company?.length ? company : "",
      email: email,
      phoneNumber: phoneNumber,
      message: message,
    });
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    const result = await fetch("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await result.json();
    console.log(data);
    setEmailSent(true);
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };
  return (
    <>
      {!emailSent ? (
        <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-text-primary font-gothic text-text-primary">
          <div className="mx-auto px-3 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
            <div className="relative max-w-xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Ask the cheeky people.
                </h2>
                <p className="mt-4 text-lg leading-6 text-text-primary">
                  How can we help?
                </p>
              </div>
              <div className="mt-12">
                <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-text-primary"
                    >
                      First name
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <div
                        className={
                          errors.firstName
                            ? `opacity-100 absolute bg-white inset-y-0 right-3 -translate-y-2 transition-all duration-500 ease-in-out`
                            : `hidden opacity-0 absolute `
                        }
                      >
                        <span className="text-red-300">
                          This field is required
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register("firstName", {
                          required: true,
                          maxLength: 20,
                        })}
                        id="first-name"
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Last name
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <div
                        className={
                          missingLastNameError
                            ? `opacity-100 absolute bg-white inset-y-0 right-3 -translate-y-2 transition-all duration-500 ease-in-out`
                            : `hidden opacity-0 absolute `
                        }
                      >
                        <span className="text-red-300">
                          This field is required
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register("lastName")}
                        id="last-name"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Company
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <input
                        type="text"
                        {...register("company")}
                        id="company"
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Email
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <div
                        className={
                          errors.email
                            ? `opacity-100 absolute bg-white inset-y-0 right-3 -translate-y-2 transition-all duration-500 ease-in-out`
                            : `hidden opacity-0 absolute `
                        }
                      >
                        <span className="text-red-300">
                          This field is required, please enter a valid email
                        </span>
                      </div>
                      <input
                        id="email"
                        {...register("email", {
                          required: true,
                          pattern: /^\S+@\S+$/i,
                        })}
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <div
                        className={
                          errors["phone-number"]
                            ? `opacity-100 absolute bg-white inset-y-0 right-3 -translate-y-2 transition-all duration-500 ease-in-out`
                            : `hidden opacity-0 absolute `
                        }
                      >
                        <span className="text-red-300">
                          This field is required, please enter a valid phone
                          number
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register("phoneNumber", {
                          required: true,
                          pattern: /^\d{10}$/,
                        })}
                        id="phone-number"
                        autoComplete="tel"
                        placeholder="07 4567 8910"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Message
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <div
                        className={
                          errors.message
                            ? `opacity-100 absolute bg-white inset-y-0 right-3 -translate-y-2 transition-all duration-500 ease-in-out`
                            : `hidden opacity-0 absolute `
                        }
                      >
                        <span className="text-red-300">
                          This field is required
                        </span>
                      </div>
                      <textarea
                        id="message"
                        {...register("message", { required: true })}
                        rows={4}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Switch
                          checked={agreed}
                          onChange={setAgreed}
                          className={classNames(
                            agreed ? "bg-text-secondary" : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
                          )}
                        >
                          <span className="sr-only">Agree to policies</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              agreed ? "translate-x-5" : "translate-x-0",
                              "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                      </div>
                      <div className="ml-3">
                        <p className="text-base text-text-primary">
                          By selecting this, you agree to the{" "}
                          <Link href="/privacy-policy">
                            <a className="underline font-medium">
                              {" "}
                              Privacy Policy
                            </a>
                          </Link>{" "}
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleSubmit(handleFormSubmit)}
                      className="w-full inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm shadow-text-primary text-base font-medium text-white bg-button hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
                    >
                      Let's talk
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-text-primary font-gothic text-text-primary">
            <div className="mx-auto px-3 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
              <div className="flex flex-col items-center justify-center w-full space-y-3">
                <span className="text-center text-4xl">
                  Thank you for your email!
                </span>
                <span className="text-sm sm:text-base">
                  We will get back to you as soon as possible.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default contactus;