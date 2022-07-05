import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import * as z from "zod";
import { cheekyBoxUserRecipient } from "@/components/CheekyBox/Pages/PageSix";

const cheekyBoxRecipient = [
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

const cheekyBoxSender = [
  {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
  },
];

export const cheekyBoxFormRouter = createRouter()
  .transformer(superjson)
  .query("list", {
    async resolve({ input, ctx }) {
      return cheekyBoxRecipient;
    },
  })
  .mutation("add", {
    input: cheekyBoxUserRecipient,
    async resolve({ input }) {
      return cheekyBoxRecipient;
    },
  });
