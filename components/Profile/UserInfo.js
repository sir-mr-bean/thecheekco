import { useState } from "react";
import { useAuth } from "../../context/FirebaseAuthContext";
import {
  doc,
  query,
  getDocs,
  collection,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import Autocomplete from "react-google-autocomplete";
import { UserState } from "../../context/User/userContext";

const UserInfo = () => {
  const { currentUser } = useAuth();
  const { userObj, dispatch } = UserState();
  console.log(userObj);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = query(
      collection(db, "users"),
      where("uid", "==", currentUser.uid)
    );
    const userDoc = getDocs(q);
    const user = await userDoc;
    const updateUser = await updateDoc(
      doc(db, "users", user.docs[0].id),
      {
        firstName: userObj.firstName || "",
        lastName: userObj.lastName || "",
        company: userObj.company || "",
        streetAddress: userObj.streetAddress || "",
        apartmentOrUnit: userObj.apartmentOrUnit || "",
        city: userObj.city || "",
        state: userObj.state || "",
        country: userObj.country || "",
        postalCode: userObj.postalCode || "",
        email: userObj.email || "",
        phoneNumber: userObj.phoneNumber || "",
      },
      { merge: true }
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="bg-white sm:p-3 m-2 sm:m-6 font-gothic sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg shadow">
          <div className="max-w-4xl mx-auto py-3 sm:px-6 sm:py-4">
            <div className="px-4 sm:px-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                Account Details
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Save your details for quick checkouts.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow px-4 py-5 rounded-md sm:rounded-lg sm:p-6 m-2 sm:m-6 sm:w-3/4 sm:mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-text-primary"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      value={userObj.firstName}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_FIRST_NAME",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary focus:ring rounded-md p-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      value={userObj.lastName}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_LAST_NAME",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary focus:ring rounded-md p-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      name="organization"
                      id="organization"
                      autoComplete="organization"
                      value={userObj.company}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_COMPANY",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary focus:ring rounded-md p-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      name="email-address"
                      id="email-address"
                      autoComplete="email"
                      value={userObj.email}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_EMAIL",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary focus:ring text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Street address
                    </label>
                    <Autocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => {
                        console.log(place);
                        const [...address_components] =
                          place.address_components;
                        console.log(address_components);
                        const apartmentOrUnit = address_components.find(
                          (component) => component.types.includes("subpremise")
                        );
                        if (apartmentOrUnit) {
                          console.log("found unit", apartmentOrUnit.long_name);
                          dispatch({
                            type: "SET_APARTMENT_OR_UNIT",
                            payload: apartmentOrUnit.long_name,
                          });
                        }
                        const streetNumber = address_components.find(
                          (component) =>
                            component.types.includes("street_number")
                        );
                        const streetAddress = address_components.find(
                          (component) => component.types.includes("route")
                        );
                        const city = address_components.find((component) =>
                          component.types.includes("locality")
                        );
                        const state = address_components.find((component) =>
                          component.types.includes(
                            "administrative_area_level_1"
                          )
                        );
                        const country = address_components.find((component) =>
                          component.types.includes("country")
                        );
                        const postalCode = address_components.find(
                          (component) => component.types.includes("postal_code")
                        );
                        console.log("unit number is");
                        dispatch({
                          type: "SET_STREET_ADDRESS",
                          payload:
                            streetNumber.long_name +
                            " " +
                            streetAddress.long_name,
                        });
                        dispatch({
                          type: "SET_CITY",
                          payload: city.long_name,
                        });
                        dispatch({
                          type: "SET_STATE",
                          payload: state.long_name,
                        });
                        dispatch({
                          type: "SET_COUNTRY",
                          payload: country.long_name,
                        });
                        dispatch({
                          type: "SET_POSTAL_CODE",
                          payload: postalCode.long_name,
                        });

                        dispatch({
                          type: "SET_STREET_NUMBER",
                          payload: streetNumber.long_name,
                        });
                      }}
                      options={{
                        componentRestrictions: { country: "au" },
                        fields: ["address_components", "geometry"],
                        types: ["address"],
                      }}
                      type="text"
                      name="street-address"
                      id="street-address"
                      value={userObj?.streetAddress}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_STREET_ADDRESS",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1 focus:ring"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="apartment-unit"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Apartment/Unit
                    </label>
                    <input
                      type="text"
                      name="apartment-unit"
                      id="apartment-unit"
                      autoComplete="address-line1"
                      value={userObj?.apartmentOrUnit}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_APARTMENT_OR_UNIT",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1 focus:ring"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-text-primary"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      value={userObj.city}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_CITY",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1 focus:ring"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-text-primary"
                    >
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      value={userObj.state}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_STATE",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary focus:ring block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Post code
                    </label>
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      value={userObj.postalCode}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_POSTAL_CODE",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary focus:ring block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={userObj.country}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_COUNTRY",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full p-1 border-text-primary bg-white rounded-md shadow-sm shadow-text-secondary focus:outline-none focus:ring-text-primary focus:ring text-text-primary focus:border-text-primary sm:text-sm"
                    >
                      <option>Australia</option>
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="tel"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Contact Phone Number
                    </label>
                    <input
                      id="tel"
                      name="tel"
                      autoComplete="tel"
                      type={userObj.phoneNumber ? "text" : "tel"}
                      value={userObj.phoneNumber}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_PHONE_NUMBER",
                          payload: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full p-1 border-text-primary bg-white rounded-md shadow-sm shadow-text-secondary focus:outline-none focus:ring-text-primary focus:ring text-text-primary focus:border-text-primary sm:text-sm"
                    ></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 rounded-md sm:rounded-lg sm:p-6 m-2 sm:m-6 sm:w-3/4 sm:mx-auto text-text-primary font-gothic">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-text-primary">
                Notifications
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Decide which communications you'd like to receive and how.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form className="space-y-6" action="#" method="POST">
                <fieldset>
                  <legend className="sr-only">By Email</legend>
                  <div
                    className="text-base font-medium text-text-primary"
                    aria-hidden="true"
                  >
                    By Email
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="h-5 flex items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          className="focus:ring-text-primary focus:ring text-text-primary h-4 w-4  border-text-primary rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="comments"
                          className="font-medium text-text-primary"
                        >
                          Comments
                        </label>
                        <p className="text-text-secondary">
                          Get notified when someones posts a comment on a
                          posting.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="focus:ring-text-primary focus:ring text-text-primary h-4 w-4  border-text-primary rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-text-primary"
                        >
                          Candidates
                        </label>
                        <p className="text-text-secondary">
                          Get notified when a candidate applies for a job.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="offers"
                          name="offers"
                          type="checkbox"
                          className="focus:ring-text-primary focus:ring text-text-primary h-4 w-4  border-text-primary rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="offers"
                          className="font-medium text-text-primary"
                        >
                          Offers
                        </label>
                        <p className="text-text-secondary">
                          Get notified when a candidate accepts or rejects an
                          offer.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="contents text-base font-medium text-text-primary">
                    Push Notifications
                  </legend>
                  <p className="text-sm text-text-secondary">
                    These are delivered via SMS to your mobile phone.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="push-everything"
                        name="push-notifications"
                        type="radio"
                        className="focus:ring-text-primary focus:ring text-text-primary h-4 w-4  border-text-primary"
                      />
                      <label
                        htmlFor="push-everything"
                        className="ml-3 block text-sm font-medium text-text-primary"
                      >
                        Everything
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="push-email"
                        name="push-notifications"
                        type="radio"
                        className="focus:ring-text-primary focus:ring text-text-primary h-4 w-4 border-text-primary"
                      />
                      <label
                        htmlFor="push-email"
                        className="ml-3 block text-sm font-medium text-text-primary"
                      >
                        Same as email
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="push-nothing"
                        name="push-notifications"
                        type="radio"
                        className="focus:ring-text-primary focus:ring text-text-primary h-4 w-4  border-text-primary"
                      />
                      <label
                        htmlFor="push-nothing"
                        className="ml-3 block text-sm font-medium text-text-primary"
                      >
                        No push notifications
                      </label>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>

        <div className="flex justify-end sm:m-6 m-2">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-text-primary rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm shadow-text-secondary text-sm font-medium rounded-md  bg-button hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary text-text-primary"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
