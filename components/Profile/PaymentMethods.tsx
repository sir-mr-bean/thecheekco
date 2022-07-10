import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { useState } from "react";
import AddPaymentMethodForm from "./PaymentMethods/AddPaymentMethodForm";
import PaymentMethodCard from "./PaymentMethods/PaymentMethod";

const PaymentMethods = ({ userObj }: { userObj: User }) => {
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
        email: userObj.email,
      },
    ],
    {
      enabled: CustomerStatus === "success",
    }
  );
  return (
    <div className="flex flex-col space-y-2">
      <div className="m-2 rounded-md bg-white font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
        <div className="max-w-4xl py-3 sm:px-6 sm:py-4">
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
      <div className="m-2 rounded-md bg-white shadow sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex w-full items-center justify-between">
              {addCard ? (
                <>
                  <div className="flex w-full flex-col items-start justify-center pb-6">
                    <div className="flex w-full items-center justify-between">
                      <h3 className="text-lg font-medium leading-6 text-text-primary">
                        Add Payment Method
                      </h3>
                      <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                        <button
                          onClick={() => {
                            setAddCard((addCard) => !addCard);
                          }}
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-button px-4 py-2 font-medium text-white shadow-sm  hover:border-black  focus:outline-none sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="w-full pt-6">
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
                  <h3 className="text-lg font-medium leading-6 text-text-primary">
                    Payment methods
                  </h3>
                  <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                    <button
                      onClick={() => {
                        setAddCard((addCard) => !addCard);
                      }}
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-button px-4 py-2 font-medium text-white shadow-sm  hover:border-black  focus:outline-none sm:text-sm"
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
                <div className="flex w-full flex-col items-start justify-center">
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-lg font-medium leading-6 text-text-primary">
                      Add Payment Method
                    </h3>
                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                      <button
                        onClick={() => {
                          setAddCard((addCard) => !addCard);
                        }}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-button px-4 py-2 font-medium text-white shadow-sm  hover:border-black  focus:outline-none sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="w-full pt-6">
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
                    <h3 className="text-lg font-medium leading-6 text-text-primary">
                      No Payment Methods Found
                    </h3>
                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                      <button
                        onClick={() => {
                          setAddCard((addCard) => !addCard);
                        }}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-button px-4 py-2 font-medium text-white shadow-sm  hover:border-black  focus:outline-none sm:text-sm"
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
