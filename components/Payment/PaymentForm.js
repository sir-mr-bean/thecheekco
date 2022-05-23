// Dependencies
import React from "react";
import { CreditCard, PaymentsForm } from "react-square-web-payments-sdk";

const PaymentForm = () => {
  return (
    <div>
      <PaymentsForm
        /**
         * Identifies the calling form with a verified application ID generated from
         * the Square Application Dashboard.
         */
        applicationId="sq0idp-Y0QZQ-Xx-Xx-Xx-Xx"
        /**
         * Invoked when payment form receives the result of a tokenize generation
         * request. The result will be a valid credit card or wallet token, or an error.
         */
        cardTokenizeResponseReceived={(token, buyer) => {
          console.info({ token, buyer });
        }}
        /**
         * This function enable the Strong Customer Authentication (SCA) flow
         *
         * We strongly recommend use this function to verify the buyer and reduce
         * the chance of fraudulent transactions.
         */
        createVerificationDetails={() => ({
          amount: "1.00",
          /* collected from the buyer */
          billingContact: {
            addressLines: ["123 Main Street", "Apartment 1"],
            familyName: "Doe",
            givenName: "John",
            countryCode: "GB",
            city: "London",
          },
          currencyCode: "GBP",
          intent: "CHARGE",
        })}
        /**
         * Identifies the location of the merchant that is taking the payment.
         * Obtained from the Square Application Dashboard - Locations tab.
         */
        locationId="LID"
      >
        <CreditCard />
      </PaymentsForm>
    </div>
  );
};

export default PaymentForm;
