import { useState } from "react";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import validator from "validator";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SpecialOrderRequest = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [missingLastNameError, setMissingLastNameError] = useState(false);
  const emailMutation = trpc.useMutation(["email.sendEmail"]);
  const [requiredDate, setRequiredDate] = useState(new Date());

  const handleFormSubmit = async (d) => {
    const { firstName, lastName, company, email, phoneNumber, type, message } =
      d;
    if (agreed) {
      emailMutation.mutate(
        {
          firstName: firstName,
          lastName: lastName,
          company: company,
          email: email,
          phoneNumber: phoneNumber,
          type: type,
          message: message,
          requiredDate: requiredDate.toString(),
        },
        {
          onSuccess: (data) => {
            setEmailSent(true);
            setTimeout(() => {
              router.push("/");
            }, 3000);
          },
        }
      );
    } else {
      setAgreedError(true);
    }
  };
  return (
    <>
      <Head>
        <title>The Cheek Co. - Special Order Request</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!emailSent ? (
        <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-text-primary font-gothic text-text-primary">
          <div className="mx-auto px-3 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
            <div className="relative max-w-xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl  tracking-tight text-text-primary font-gothic sm:text-4xl">
                  Special Order Request
                </h2>
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
                          errors.phoneNumber
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
                      htmlFor="date-required"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Date Required By:
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                      <DatePicker
                        selected={requiredDate}
                        onChange={(date: Date) => setRequiredDate(date)}
                        id="date-required"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="type-of-request"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Type of Order
                    </label>
                    <div className="relative mt-1 flex flex-col space-y-2 w-full px-3 py-2 text-text-primary transition duration-2000 ease-in-out sm:text-sm sm:leading-5 ">
                      <div className="flex space-x-2 items-center">
                        <input
                          {...register("type")}
                          type="radio"
                          value="Customisation"
                          defaultChecked
                          className="w-4 h-4 accent-text-primary"
                        />
                        <span className="text-base">Customisation</span>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <input
                          {...register("type")}
                          type="radio"
                          value="Bulk Order"
                          className="w-4 h-4 accent-text-primary"
                        />
                        <span className="text-base">Bulk Order</span>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <input
                          {...register("type")}
                          type="radio"
                          value="Corporate Gifting"
                          className="w-4 h-4 accent-text-primary"
                        />
                        <span className="text-base">Corporate Gifting</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Message
                    </label>
                    <div className="relative mt-1 flex w-full px-3 py-2 border shadow-sm rounded-md focus:outline-none shadow-text-primary focus:shadow-outline-blue focus:border-text-primary transition duration-2000 ease-in-out sm:text-sm sm:leading-5">
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
                  <div className="sm:col-span-2 relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Switch
                          checked={agreed}
                          onChange={() => {
                            setAgreed((agreed) => !agreed);
                            setAgreedError(false);
                          }}
                          className={classNames(
                            agreed ? "bg-text-secondary" : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-2000 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
                          )}
                        >
                          <span className="sr-only">Agree to policies</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              agreed ? "translate-x-5" : "translate-x-0",
                              "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-2000"
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
                      <div
                        className={
                          agreedError
                            ? `opacity-100 absolute bg-white inset-y-0 -right-20 -translate-y-0 transition-all duration-2000 ease-in-out h-fit`
                            : `absolute opacity-0 invisible`
                        }
                      >
                        <span className="text-red-300">
                          Please agree to the privacy policy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleSubmit(handleFormSubmit)}
                      className="w-full inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm shadow-text-primary text-base font-medium text-white bg-button hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
                    >
                      Submit
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
                  Thank you for your request!
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

export default SpecialOrderRequest;
