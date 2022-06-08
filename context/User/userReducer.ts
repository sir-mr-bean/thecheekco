import { User } from "@/types/User";

export type UserAction =
  | {
      type: "SET_USER";
      payload: User;
    }
  | {
      type: "CLEAR_USER";

      payload: null;
    }
  | {
      type: "SET_FIRST_NAME";
      payload: string;
    }
  | {
      type: "SET_LAST_NAME";
      payload: string;
    }
  | {
      type: "SET_COMPANY";
      payload: string;
    }
  | {
      type: "SET_STREET_ADDRESS";
      payload: string;
    }
  | {
      type: "SET_APARTMENT_OR_UNIT";
      payload: string;
    }
  | {
      type: "SET_CITY";
      payload: string;
    }
  | {
      type: "SET_STATE";
      payload: string;
    }
  | {
      type: "SET_COUNTRY";
      payload: string;
    }
  | {
      type: "SET_POSTAL_CODE";
      payload: string;
    }
  | {
      type: "SET_EMAIL";
      payload: string;
    }
  | {
      type: "SET_PHONE_NUMBER";
      payload: string;
    };

export default function UserReducer(state: User, action: UserAction): User {
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

export const setUserObj = (userObj: User) => ({
  type: "SET_USER",
  payload: userObj,
});
