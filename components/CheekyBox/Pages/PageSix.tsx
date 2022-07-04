import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { trpc } from "utils/trpc";
import { z } from "zod";
import CheekyBoxForm from "./CheekyBoxForm/CheekyBoxForm";
import GifterForm from "./CheekyBoxForm/GifterForm";
import GiftToggle from "./CheekyBoxForm/GiftToggle";

// validation schema is used by server
export const cheekyBoxUserRecipient = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least two characters long." })
    .max(20, { message: "First name must be at most twenty characters long." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least two characters long." })
    .max(25, {
      message: "Last name must be at most twenty-five characters long.",
    }),
  company: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least eight characters long." })
    .max(10, { message: "Phone number must be at most ten characters long." }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long." })
    .max(40, { message: "Address must be at most fourty characters long." }),
  city: z
    .string()
    .min(2, { message: "City must be at least two characters long." })
    .max(25, { message: "City must be at most twenty-five characters long." }),
  state: z.enum(["", "ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]),
  postCode: z
    .string()
    .min(4, { message: "Post Code must contain four numbers" })
    .max(4, { message: "Post Code must contain four numbers" }),
  country: z.literal("Australia", {
    invalid_type_error: "Country must be Australia",
  }),
});

export const cheekyBoxUserGifter = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least two characters long." })
    .max(20, { message: "First name must be at most twenty characters long." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least two characters long." })
    .max(25, {
      message: "Last name must be at most twenty-five characters long.",
    }),
  company: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least eight characters long." })
    .max(10, { message: "Phone number must be at most ten characters long." }),
});

export default function PageSix({
  gift,
  setGift,
  giftForm,
  gifterForm,
  nextStep,
}: {
  gift: boolean;
  setGift: (gift: boolean) => void;
  giftForm: UseFormReturn<any>;
  gifterForm: UseFormReturn<any>;
  nextStep: () => void;
}) {
  const utils = trpc.useContext();
  const { data: formData } = trpc.useQuery(["cheekybox-form.list"]);

  const mutation = trpc.useMutation("cheekybox-form.add", {
    async onSuccess() {
      await utils.invalidateQueries(["cheekybox-form.list"]);
    },
  });

  return (
    <>
      {formData && (
        <>
          <GiftToggle gift={gift} setGift={setGift} />
          {gift ? (
            <>
              <div className="flex flex-col space-y-6">
                <h2 className="text-2xl">Your Contact Details</h2>
                <GifterForm gifterForm={gifterForm} />
                <h2 className="text-2xl">Recipient's Details</h2>
                <CheekyBoxForm giftForm={giftForm} />
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-6">
              <h2 className="text-2xl">Your Contact Details</h2>
              <CheekyBoxForm giftForm={giftForm} />
            </div>
          )}
        </>
      )}
    </>
  );
}
