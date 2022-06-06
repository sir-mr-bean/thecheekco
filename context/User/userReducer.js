export default function UserReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_FIRST_NAME":
      return {
        ...state,
        firstName: action.payload,
      };
    case "SET_LAST_NAME":
      return {
        ...state,
        lastName: action.payload,
      };
    case "SET_COMPANY":
      return {
        ...state,
        company: action.payload,
      };
    case "SET_STREET_ADDRESS":
      console.log("setting address with", action.payload);
      return {
        ...state,
        streetAddress: action.payload,
      };

    case "SET_APARTMENT_OR_UNIT":
      return {
        ...state,
        apartmentOrUnit: action.payload,
      };
    case "SET_CITY":
      return {
        ...state,
        city: action.payload,
      };
    case "SET_STATE":
      return {
        ...state,
        state: action.payload,
      };
    case "SET_COUNTRY":
      return {
        ...state,
        country: action.payload,
      };
    case "SET_POSTAL_CODE":
      return {
        ...state,
        postalCode: action.payload,
      };
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "SET_PHONE_NUMBER":
      return {
        ...state,
        phoneNumber: action.payload,
      };

    default:
      return state;
  }
}

export const setUserObj = (userObj) => ({
  type: "SET_USER",
  payload: userObj,
});
