import CACFormField from "./CACFormField";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { User } from "@prisma/client";

export const cacFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least two characters long." })
      .max(20, {
        message: "First name must be at most twenty characters long.",
      }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least two characters long." })
      .max(25, {
        message: "Last name must be at most twenty-five characters long.",
      }),
    emailAddress: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .min(8, {
        message: "Phone number must be at least eight characters long.",
      })
      .max(12, {
        message: "Phone number must be at most ten characters long.",
      }),
    termsAccepted: z.literal(true),
  })
  .required();

const CACForm = ({
  form,
  userObj,
}: {
  form: UseFormReturn<any>;
  userObj: User;
}) => {
  return (
    <form
      autoComplete="off"
      className="mt-4 w-full font-gothic text-text-primary"
    >
      <input type="hidden" defaultValue="something" />
      <div>
        <h2 className="text-lg font-medium ">Billing Contact</h2>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {/* content here */}
          <CACFormField
            form={form}
            defaultValue={userObj?.firstName}
            field="First Name"
          />
          <CACFormField
            form={form}
            defaultValue={userObj?.lastName}
            field="Last Name"
          />
          <div className="sm:col-span-2">
            <CACFormField
              form={form}
              defaultValue={userObj?.email}
              field="Email Address"
            />
          </div>
          <div className="sm:col-span-2">
            <CACFormField
              form={form}
              defaultValue={userObj?.phoneNumber}
              field="Phone Number"
            />
          </div>
          <div className="sm:col-span-2">
            <CACFormField
              form={form}
              defaultValue={null}
              field="Terms Accepted"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CACForm;
