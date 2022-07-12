import { User } from "@prisma/client";
import { useRef } from "react";

const CACForm = ({
  userObj,
  setUserObj,
  termsAccepted,
  setTermsAccepted,
  register,
}: {
  userObj: User;
  setUserObj: Function;
  termsAccepted: boolean;
  setTermsAccepted: Function;
  register: Function;
}) => {
  const termsCheckboxRef = useRef<HTMLInputElement>(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {userObj && (
        <form
          autoComplete="off"
          className="mt-4 w-full font-gothic text-text-primary"
        >
          <input type="hidden" defaultValue="something" />
          <div>
            <h2 className="text-lg font-medium ">Billing Contact</h2>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-text-primary"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="first-name"
                    name="first-name"
                    autoComplete="given-name"
                    defaultValue={userObj?.firstName as string}
                    onChange={(e) =>
                      setUserObj({
                        ...userObj,
                        firstName: e.target.value,
                      })
                    }
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                <div className="mt-1">
                  <input
                    type="text"
                    id="last-name"
                    name="last-name"
                    autoComplete="family-name"
                    defaultValue={userObj?.lastName as string}
                    onChange={(e) =>
                      setUserObj({
                        ...userObj,
                        lastName: e.target.value,
                      })
                    }
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary"
                >
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="email"
                    defaultValue={userObj?.email as string}
                    onChange={(e) =>
                      setUserObj({
                        ...userObj,
                        email: e.target.value,
                      })
                    }
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-primary"
                >
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    id="tel"
                    {...register("tel")}
                    autoComplete="tel"
                    type={userObj.phoneNumber ? "text" : "tel"}
                    defaultValue={userObj.phoneNumber as string}
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        phoneNumber: e.target.value,
                      });
                    }}
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col space-x-2 space-y-2">
            <div className="flex items-center space-x-2 ">
              <input
                onChange={() =>
                  setTermsAccepted((termsAccepted: boolean) => !termsAccepted)
                }
                ref={termsCheckboxRef}
                checked={termsAccepted}
                id="terms"
                name="terms"
                type="checkbox"
                className="h-6 w-6 rounded border-text-secondary text-text-secondary accent-text-secondary focus:ring-text-secondary"
              />
              <label
                htmlFor="terms"
                className="select-none text-sm text-text-primary"
              >
                I have read the terms and conditions and privacy policy.
              </label>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CACForm;
