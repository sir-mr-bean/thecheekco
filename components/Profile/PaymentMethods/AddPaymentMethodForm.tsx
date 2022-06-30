import { validationErrors } from "@/pages/checkout";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

const AddPaymentMethodForm = ({
  userObject,
  setAddCard,
  refetchPaymentMethods,
}: {
  userObject: User;
  setAddCard: Function;
  refetchPaymentMethods: Function;
}) => {
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [validationErrors, setValidationErrors] = useState<validationErrors>({
    name: false,
    email: false,
    phone: false,
    streetAddress: false,
    city: false,
    state: false,
    zip: false,
  });
  const [userObj, setUserObj] = useState(userObject);
  const [processing, setProcessing] = useState(false);
  const utils = trpc.useContext();
  const {
    data: customer,
    status,
    refetch,
  } = trpc.useQuery([
    "square-customer.search-customer",
    {
      email: userObj.email,
    },
  ]);
  const createCustomer = trpc.useMutation(["square-customer.create-customer"]);
  const saveCardMutation = trpc.useMutation([
    "square-payment.create-customer-payment-method",
  ]);

  return (
    <>
      {userObj && (
        <form
          autoComplete="off"
          className="mt-4 text-text-primary font-gothic w-full"
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
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
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
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
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
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <div className="relative">
                  {validationErrors.streetAddress && (
                    <span className="text-red-500 text-xs sm:text-sm absolute top-4 right-0 bg-white rounded-sm px-1 font-gothic">
                      This field is required
                    </span>
                  )}
                </div>
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium text-text-primary"
                >
                  Street address
                </label>
                <Autocomplete<
                  ReactGoogleAutocompleteInputProps & {
                    value: string;
                  }
                >
                  apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                  onPlaceSelected={(place) => {
                    const apartmentOrUnit = place?.address_components?.find(
                      (component) => component.types.includes("subpremise")
                    );

                    const streetNumber = place?.address_components?.find(
                      (component) => component.types.includes("street_number")
                    );
                    const streetAddress = place?.address_components?.find(
                      (component) => component.types.includes("route")
                    );
                    const city = place?.address_components?.find((component) =>
                      component.types.includes("locality")
                    );
                    const state = place?.address_components?.find((component) =>
                      component.types.includes("administrative_area_level_1")
                    );
                    const country = place?.address_components?.find(
                      (component) => component.types.includes("country")
                    );
                    const postalCode = place?.address_components?.find(
                      (component) => component.types.includes("postal_code")
                    );

                    setUserObj({
                      ...userObj,
                      streetNumber: streetNumber?.long_name as string,
                      streetAddress: streetNumber?.long_name
                        ? `${streetNumber?.long_name} ${streetAddress?.long_name}`
                        : `${streetAddress?.long_name}`,
                      apartmentOrUnit: apartmentOrUnit
                        ? apartmentOrUnit?.long_name
                        : "",
                      city: city?.long_name as string,
                      state: state?.long_name as string,
                      country: country?.long_name as string,
                      postalCode: postalCode?.long_name as string,
                    });
                  }}
                  options={{
                    componentRestrictions: { country: "au" },
                    fields: ["address_components", "formatted_address"],
                    types: ["address"],
                  }}
                  {...register("street-address")}
                  id="street-address"
                  //defaultValue={userObj?.streetAddress as string}
                  value={userObj?.streetAddress as string}
                  inputAutocompleteValue={userObj?.streetAddress as string}
                  onChange={(e) => {
                    setValidationErrors((validationErrors) => {
                      return { ...validationErrors, streetAddress: false };
                    });
                    setUserObj({
                      ...userObj,
                      streetAddress: (e.target as HTMLTextAreaElement).value,
                    });
                  }}
                  className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring"
                />
                <input
                  hidden
                  id="street-address"
                  ref={streetAddressRef}
                  type="text"
                  value={userObj?.streetAddress as string}
                  autoComplete="off"
                  onChange={(e) => {
                    setUserObj({
                      ...userObj,
                      streetAddress: (e.target as HTMLInputElement).value,
                    });
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="apartment"
                  className="block text-sm font-medium text-text-primary"
                >
                  Apartment, suite, etc.
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    {...register("apartment-unit")}
                    id="apartment-unit"
                    autoComplete="address-line1"
                    value={
                      userObj.apartmentOrUnit
                        ? (userObj?.apartmentOrUnit as string)
                        : ""
                    }
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        apartmentOrUnit: e.target.value,
                      });
                    }}
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-text-primary"
                >
                  City
                </label>
                <div className="mt-1 relative">
                  <div>
                    {validationErrors.city && (
                      <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                        This field is required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    {...(register("guest-city"),
                    {
                      required: true,
                      value: userObj.city ? (userObj.city as string) : "",
                      onChange: (e) => {
                        setValidationErrors((validationErrors) => {
                          return { ...validationErrors, city: false };
                        });
                        setUserObj({
                          ...userObj,
                          city: e.target.value,
                        });
                      },
                    })}
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-text-primary"
                >
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    {...register("country")}
                    autoComplete="country-name"
                    value={userObj?.country ? (userObj.country as string) : ""}
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        country: e.target.value,
                      });
                    }}
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
                  >
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-text-primary"
                >
                  State
                </label>
                <div className="mt-1">
                  <select
                    {...(register("guest-region"),
                    {
                      value: (userObj.state as string) || "ACT",
                      onChange: (e) =>
                        setUserObj({ ...userObj, state: e.target.value }),
                    })}
                    id="guest-region"
                    autoComplete="address-level1"
                    className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full border sm:text-sm border-text-secondary rounded-md p-1 py-1.5 focus:ring"
                  >
                    <option>ACT</option>
                    <option>NSW</option>
                    <option>NT</option>
                    <option>QLD</option>
                    <option>SA</option>
                    <option>TAS</option>
                    <option>VIC</option>
                    <option>WA</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium text-text-primary"
                >
                  Post code
                </label>
                <div className="mt-1 relative">
                  <div>
                    {validationErrors.zip && (
                      <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                        This field is required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    {...(register("postal-code"),
                    {
                      value: userObj?.postalCode
                        ? (userObj.postalCode as string)
                        : "",
                      onChange: (e) => {
                        setValidationErrors({
                          ...validationErrors,
                          zip: false,
                        });
                        setUserObj({
                          ...userObj,
                          postalCode: e.target.value,
                        });
                      },
                      maxLength: 4,
                      required: true,
                      pattern: "/^[0-9]{4}$/",
                    })}
                    maxLength={4}
                    id="postal-code"
                    autoComplete="postal-code"
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
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
                    name="phone"
                    autoComplete="tel"
                    type={userObj.phoneNumber ? "text" : "tel"}
                    defaultValue={userObj.phoneNumber as string}
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        phoneNumber: e.target.value,
                      });
                    }}
                    className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="md:w-2/3 md:mx-auto pt-16">
        <PaymentForm
          applicationId={
            process.env.NEXT_PUBLIC_SQUARE_APP_ID
              ? process.env.NEXT_PUBLIC_SQUARE_APP_ID
              : ""
          }
          locationId={
            process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
              ? process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
              : ""
          }
          // createPaymentRequest={() => ({
          //   countryCode: "AU",
          //   currencyCode: "AUD",
          //   displayItems: [
          //     {
          //       amount: "22.15",
          //       label: "Item to be purchased",
          //       id: "SKU-12345",
          //       imageUrl: "https://url-cdn.com/123ABC",
          //       pending: true,
          //       productUrl: "https://my-company.com/product-123ABC",
          //     },
          //   ],
          //   taxLineItems: [
          //     {
          //       label: "State Tax",
          //       amount: "8.95",
          //       pending: true,
          //     },
          //   ],
          //   requestBillingContact: false,
          //   requestShippingContact: false,
          //   total: {
          //     amount: "22.15",
          //     label: "Total",
          //   },
          // })}
          cardTokenizeResponseReceived={async (token, buyer) => {
            setProcessing(true);
            if (!customer?.id) {
              createCustomer.mutate(
                {
                  email: userObj.email,
                  firstName: userObj.firstName as string,
                  lastName: userObj.lastName as string,
                  phoneNumber: userObj.phoneNumber as string,
                  address: {
                    addressLine1: userObj.streetAddress as string,
                    postalCode: userObj.postalCode as string,
                    region: userObj.state as string,
                    locality: userObj.state as string,
                    country: "Australia",
                  },
                },
                {
                  onSuccess: (data) => {
                    utils.invalidateQueries([
                      "square-customer.search-customer",
                    ]);
                    console.log(data);
                    console.log(customer);
                  },
                }
              );
            }
            saveCardMutation.mutate(
              {
                customerId: customer?.id ? customer.id : "",
                token: {
                  cardDetails: {
                    billingAddress: {
                      postalCode: userObj?.postalCode as string,
                      country: "AU",
                      addressLine1: userObj.streetAddress as string,
                      addressLine2: userObj.city as string,
                      locality: userObj.state as string,
                    },
                    expMonth: token.details?.card?.expMonth as number,
                    expYear: token.details?.card?.expYear as number,
                    holderName: userObj.name as string,
                  },
                  cardNonce: token.token as string,
                },
              },
              {
                onSuccess: (data) => {
                  refetchPaymentMethods();
                  utils
                    .refetchQueries([
                      "square-payment.get-customer-payment-methods",
                    ])
                    .then(() => {
                      setAddCard((addCard: boolean) => !addCard);
                      setProcessing(false);
                      toast.success("Card added successfully");
                    });
                },

                onError: (error) => {
                  setProcessing(false);
                  toast.error(
                    "Failed to add card. Please check the details and try again"
                  );
                },
              }
            );
          }}
        >
          <CreditCard
            includeInputLabels
            buttonProps={{
              isLoading: processing,
              css: {
                backgroundColor: "#a75e2f",
                fontSize: "14px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#E3BB9D",
                },
              },
            }}
          >
            {processing ? (
              <div className="flex w-full items-center justify-center space-x-2">
                <span>Adding Card...</span>
                <BeatLoader size={8} color="#602d0d" />
              </div>
            ) : (
              <span>Add Card</span>
            )}
          </CreditCard>
        </PaymentForm>
      </div>
    </>
  );
};

export default AddPaymentMethodForm;
