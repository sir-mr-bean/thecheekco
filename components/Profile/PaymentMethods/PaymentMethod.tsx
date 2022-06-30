import { trpc } from "@/utils/trpc";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "square";

const PaymentMethodCard = ({
  paymentMethod,
  refetchPaymentMethods,
}: {
  paymentMethod: Card;
  refetchPaymentMethods: Function;
}) => {
  const [editCard, setEditCard] = useState(false);
  const utils = trpc.useContext();
  const deleteCardMutation = trpc.useMutation([
    "square-payment.delete-customer-payment-method",
  ]);

  const handleDeleteCard = async () => {
    deleteCardMutation.mutate(
      {
        paymentMethodId: paymentMethod.id as string,
        customerId: paymentMethod.customerId as string,
      },
      {
        onSuccess: () => {
          refetchPaymentMethods();
          utils.invalidateQueries([
            "square-payment.get-customer-payment-methods",
          ]);
          utils
            .refetchQueries(["square-payment.get-customer-payment-methods"])
            .then(() => {
              toast.success("Card deleted successfully");
              setEditCard(false);
            });
        },
      }
    );
  };

  return (
    <div className="mt-5">
      <div className="rounded-md bg-gray-50 px-6 py-5 flex items-center justify-between w-full">
        {paymentMethod.cardBrand === "VISA" ? (
          <>
            <h4 className="sr-only">Visa</h4>
            <div className="sm:flex sm:items-start">
              <svg
                className="h-8 w-auto sm:flex-shrink-0 sm:h-6"
                viewBox="0 0 36 24"
                aria-hidden="true"
              >
                <rect width={36} height={24} fill="#224DBA" rx={4} />
                <path
                  fill="#fff"
                  d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                />
              </svg>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <div className="text-sm font-medium text-text-primary">
                  Ending with {paymentMethod.last4}
                </div>
                <div className="mt-1 text-sm text-text-secondary sm:flex sm:items-center">
                  <span>
                    Expires {paymentMethod.expMonth?.toString()}/
                    {paymentMethod.expYear?.toString()}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          paymentMethod.cardBrand === "MASTERCARD" && (
            <>
              <h4 className="sr-only">Mastercard</h4>
              <div className="sm:flex sm:items-start">
                <img src="/images/Mastercard-logo.svg" width={52} height={28} />
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <div className="text-sm font-medium text-text-primary">
                    Ending with {paymentMethod.last4}
                  </div>
                  <div className="mt-1 text-sm text-text-secondary sm:flex sm:items-center">
                    <span>
                      Expires {paymentMethod.expMonth?.toString()}/
                      {paymentMethod.expYear?.toString()}
                    </span>
                    <span
                      className="hidden sm:mx-2 sm:inline"
                      aria-hidden="true"
                    >
                      &middot;
                    </span>
                  </div>
                </div>
              </div>
            </>
          )
        )}

        <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
          {editCard ? (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => {
                  setEditCard((editCard) => !editCard);
                }}
                type="button"
                className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-button  focus:outline-none sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCard}
                type="button"
                className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-red-400  focus:outline-none sm:text-sm"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditCard((editCard) => !editCard);
              }}
              type="button"
              className="inline-flex items-center px-4 py-2 text-white border border-transparent hover:border-black shadow-sm font-medium rounded-md  bg-button  focus:outline-none sm:text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
