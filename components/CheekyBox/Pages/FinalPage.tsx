import {
  IntroOptions,
  PageFiveOptions,
  PageFourOptions,
  PageOneOptions,
  PageThreeOptions,
  PageTwoOptions,
} from "@/types/PageOptions";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import {
  CreditCard,
  GooglePay,
  PaymentForm,
} from "react-square-web-payments-sdk";
import CheckoutResults from "./FinalPage/CheckoutResults";

const FinalPage = ({
  introOptions,
  pageOneOptions,
  pageTwoOptions,
  pageThreeOptions,
  pageFourOptions,
  pageFiveOptions,
  gift,
}: {
  introOptions: IntroOptions;
  pageOneOptions: PageOneOptions;
  pageTwoOptions: PageTwoOptions;
  pageThreeOptions: PageThreeOptions;
  pageFourOptions: PageFourOptions;
  pageFiveOptions: PageFiveOptions;
  gift: boolean;
}) => {
  return (
    <>
      <span className="flex w-full items-center justify-center pb-3 text-lg sm:text-3xl">
        luxury is just a click away.
      </span>
      <div className="flex w-full flex-col items-start justify-center rounded-xl bg-white py-4">
        <div className="w-full px-4">
          <h1 className="border border-x-transparent border-t-transparent border-b-text-secondary pb-6 text-2xl text-text-secondary">
            Subscription Box Checkout
          </h1>
        </div>
        <div className="font-gothica grid w-full grid-cols-1 justify-center  sm:grid-cols-2">
          <div className="order-last w-full p-2 sm:order-first">
            <div className="flex h-24 w-full pl-4">
              <div className="w-full pt-8 text-base">
                <span className="text-center text-text-secondary">
                  Thanks for choosing cheeky! We cannot wait to ship your
                  goodies
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center space-y-3 sm:items-start sm:pl-4">
              <span className="w-full pl-4 font-semibold text-text-secondary">
                Payment Method
              </span>
              <div className="m-4 w-fit rounded-lg bg-button p-8 sm:m-0">
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
                  createPaymentRequest={() => ({
                    countryCode: "AU",
                    currencyCode: "AUD",
                    displayItems: [
                      {
                        amount: "22.15",
                        label: "Item to be purchased",
                        id: "SKU-12345",
                        imageUrl: "https://url-cdn.com/123ABC",
                        pending: true,
                        productUrl: "https://my-company.com/product-123ABC",
                      },
                    ],
                    taxLineItems: [
                      {
                        label: "State Tax",
                        amount: "8.95",
                        pending: true,
                      },
                    ],
                    requestBillingContact: false,
                    requestShippingContact: false,
                    total: {
                      amount: "100",
                      label: "Total",
                    },
                  })}
                  cardTokenizeResponseReceived={async (token, buyer) => {}}
                >
                  <CreditCard
                    includeInputLabels
                    buttonProps={{
                      isLoading: false,
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
                    <div className="flex h-full w-full items-center justify-center">
                      {introOptions.duration === "monthly" ? (
                        <span className="text-white">Pay $49.99</span>
                      ) : (
                        <span className="text-white"> Pay $149.97</span>
                      )}
                      {/* {orderProcessing ? (
                                            <div className="flex w-full items-center justify-center space-x-2">
                                              <span>Processing Order</span>
                                              <BeatLoader
                                                size={8}
                                                color="#602d0d"
                                              />
                                            </div>
                                          ) : (
                                            <span>Pay ${total.toFixed(2)}</span>
                                          )} */}
                    </div>
                  </CreditCard>
                  <div className="py-4">
                    <GooglePay buttonColor="white" />
                  </div>
                </PaymentForm>
              </div>
            </div>
            <div className="pl-4 pt-4">
              <span className="text-xs text-text-secondary">
                Subscription boxes will be posted on the 7th of each new month,
                please allow up to two weeks for shipping. Subscriptions can be
                paused for up to 2 months and cancelled at any time*
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-start pl-8">
            <CheckoutResults introOptions={introOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinalPage;
