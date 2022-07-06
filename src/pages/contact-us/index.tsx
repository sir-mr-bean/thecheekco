import { useState } from "react";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import * as z from "zod";
import { useZodForm } from "@/utils/hooks/useZodForm";
import FormField from "@/components/CheekyBox/Pages/CheekyBoxForm/FormField";
import toast from "react-hot-toast";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const emailValidation = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be at least two characters long." })
    .max(20, { message: "Must be at most twenty characters long." }),
  lastName: z
    .string()
    .min(2, { message: "Must be at least two characters long." })
    .max(25, {
      message: "Must be at most twenty-five characters long.",
    }),
  company: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Must be at least eight characters long." })
    .max(10, { message: "Must be at most ten characters long." }),

  message: z
    .string()
    .min(2, { message: "Must be at least two characters long." })
    .max(200, { message: "Must be at most 200 characters long." }),
});

const contactus = () => {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [missingLastNameError, setMissingLastNameError] = useState(false);
  const emailMutation = trpc.useMutation(["email.sendEmail"]);
  const sendEmailMutation = trpc.useMutation(["contact-us-form.send-email"]);

  const contactUsForm = useZodForm({
    schema: emailValidation,
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const handleFormSubmit = async () => {
    if (!agreed) {
      return toast.error("You must agree to the privacy policy.");
    }
    await contactUsForm.trigger();
    if (contactUsForm.formState.isValid) {
      const { firstName, lastName, company, email, phoneNumber, message } =
        contactUsForm.getValues();

      sendEmailMutation.mutate(
        {
          firstName,
          lastName,
          company,
          email,
          phoneNumber,
          message,
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
    }
  };
  return (
    <>
      <Head>
        <title>The Cheek Co. - Contact Us</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!emailSent ? (
        <div className="z-100 bg-bum-banner bg-cover bg-bottom bg-origin-content pb-10 pt-10">
          <div className="mx-auto w-fit rounded-md bg-white px-10 font-gothic text-text-primary shadow-sm shadow-text-primary">
            <div className="px-3 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
              <div className="relative mx-auto max-w-xl">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                    Ask the cheeky people.
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-text-primary">
                    How can we help?
                  </p>
                </div>
                <div className="mt-12">
                  <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <FormField field="First Name" form={contactUsForm} />
                    <FormField field="Last Name" form={contactUsForm} />
                    <FormField field="Company" form={contactUsForm} />
                    <FormField field="Email" form={contactUsForm} />
                    <FormField field="Phone Number" form={contactUsForm} />
                    <div className="col-span-1 sm:col-span-2">
                      <FormField field="Message" form={contactUsForm} />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Switch
                            checked={agreed}
                            onChange={setAgreed}
                            className={classNames(
                              agreed ? "bg-text-secondary" : "bg-gray-200",
                              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
                            )}
                          >
                            <span className="sr-only">Agree to policies</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                agreed ? "translate-x-5" : "translate-x-0",
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </div>
                        <div className="ml-3">
                          <p className="text-base text-text-primary">
                            By selecting this, you agree to the{" "}
                            <Link href="/privacy-policy">
                              <a className="font-medium underline">
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
                        onClick={handleFormSubmit}
                        className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-button px-6 py-2 text-base font-medium text-white shadow-sm shadow-text-primary hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
                      >
                        Let's talk
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mx-1 mt-16 rounded-md bg-white font-gothic text-text-primary shadow-sm shadow-text-primary md:mx-16">
            <div className="mx-auto px-3 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
              <div className="flex w-full flex-col items-center justify-center space-y-3">
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
