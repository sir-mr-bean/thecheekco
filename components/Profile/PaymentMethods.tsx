import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import PaymentWrapper from "../Checkout/PaymentWrapper";
import AddPaymentMethodForm from "./PaymentMethods/AddPaymentMethodForm";
import PaymentMethodCard from "./PaymentMethods/PaymentMethod";

const PaymentMethods = ({ userObj }) => {
  const [addCard, setAddCard] = useState(false);

  const { data: customer, status: CustomerStatus } = trpc.useQuery([
    "square-customer.search-customer",
    {
      email: userObj.email,
    },
  ]);
  const {
    data: paymentMethods,
    status,
    refetch: refetchPaymentMethods,
    dataUpdatedAt,
  } = trpc.useQuery(
    [
      "square-payment.get-customer-payment-methods",
      {
        customerId: customer?.id as string,
      },
    ],
    {
      enabled: CustomerStatus === "success",
    }
  );
  console.log(dataUpdatedAt, status);
  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-white sm:p-3 m-2 sm:m-6 font-gothic sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg shadow">
        <div className="max-w-4xl mx-auto py-3 sm:px-6 sm:py-4">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Payment Methods
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Add or remove payment methods.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow sm:w-3/4 sm:mx-auto sm:p-3 m-2 rounded-md sm:rounded-lg">
        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between w-full">
              {addCard ? (
                <>
                  <div className="flex flex-col items-start justify-center w-full pb-6">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-lg leading-6 font-medium text-text-primary">
                        Add Payment Method
                      </h3>
                      <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                        <button
                          onClick={() => {
                            setAddCard((addCard) => !addCard);
                          }}
                          type="button"
                          className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-button  focus:outline-none sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="pt-6 w-full">
                      <AddPaymentMethodForm
                        setAddCard={setAddCard}
                        userObject={userObj}
                        refetchPaymentMethods={refetchPaymentMethods}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg leading-6 font-medium text-text-primary">
                    Payment methods
                  </h3>
                  <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                    <button
                      onClick={() => {
                        setAddCard((addCard) => !addCard);
                      }}
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-button  focus:outline-none sm:text-sm"
                    >
                      Add Card
                    </button>
                  </div>
                </>
              )}
            </div>
            {paymentMethods.map((paymentMethod) => (
              <PaymentMethodCard
                key={paymentMethod.id}
                paymentMethod={paymentMethod}
                refetchPaymentMethods={refetchPaymentMethods}
              />
            ))}
          </div>
        ) : (
          <div>
            <div className="px-4 py-5 sm:p-6">
              {addCard ? (
                <div className="flex flex-col items-start justify-center w-full">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg leading-6 font-medium text-text-primary">
                      Add Payment Method
                    </h3>
                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                      <button
                        onClick={() => {
                          setAddCard((addCard) => !addCard);
                        }}
                        type="button"
                        className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-button  focus:outline-none sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="pt-6 w-full">
                    <AddPaymentMethodForm
                      setAddCard={setAddCard}
                      userObject={userObj}
                      refetchPaymentMethods={refetchPaymentMethods}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-text-primary">
                      No Payment Methods Found
                    </h3>
                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                      <button
                        onClick={() => {
                          setAddCard((addCard) => !addCard);
                        }}
                        type="button"
                        className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-button  focus:outline-none sm:text-sm"
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
