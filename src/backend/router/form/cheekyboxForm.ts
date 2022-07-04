import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import * as z from "zod";
import { cheekyBoxUserObject } from "@/components/CheekyBox/Pages/PageSix";

const cheekyBoxUser = [
  {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postCode: "",
    country: "Australia",
  },
];

export const cheekyBoxFormRouter = createRouter()
  .transformer(superjson)
  .query("list", {
    async resolve({ input, ctx }) {
      return cheekyBoxUser;
    },
  })
  .mutation("add", {
    input: cheekyBoxUserObject,
    async resolve({ input }) {
      console.log(input);
      return cheekyBoxUser;
    },
  });
