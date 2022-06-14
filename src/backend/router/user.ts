import { createRouter } from "../createRouter";
import { z } from "zod";
import type { User } from "@prisma/client";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());
type DateSchema = z.infer<typeof dateSchema>;

const UserInterface: z.ZodType<User> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: dateSchema as z.ZodType<DateSchema>,
    updatedAt: dateSchema as z.ZodType<DateSchema>,
    name: z.string().optional() as z.ZodType<string>,
    image: z.string().optional() as z.ZodType<string>,
    emailVerified: z.nullable(dateSchema) as z.ZodType<DateSchema | null>,
    password: z.nullable(z.string()) as z.ZodType<string | null>,
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional() as z.ZodType<string>,
    streetAddress: z.string().optional() as z.ZodType<string>,
    streetNumber: z.string().optional() as z.ZodType<string | null>,
    apartmentOrUnit: z.string().optional() as z.ZodType<string>,
    city: z.string().optional() as z.ZodType<string>,
    state: z.string().optional() as z.ZodType<string>,
    country: z.string().optional() as z.ZodType<string>,
    postalCode: z.string().optional() as z.ZodType<string>,
    email: z.string(),
    phoneNumber: z.string().optional() as z.ZodType<string>,
    isAdmin: z.boolean().optional() as z.ZodType<boolean>,
  })
);

export const userRouter = createRouter().mutation("updateUser", {
  input: z.object({
    email: z.string(),
    user: UserInterface,
  }),
  async resolve({ input, ctx }) {
    const { email, user } = input;
    const { prisma } = ctx;
    console.log("session is ", ctx.session);
    const { id } = user;
    const currentUser = await prisma.user.findUnique({
      where: { id },
    });
    console.log("current user is ", currentUser);
    const currentSession = await prisma.session.findFirst({
      where: { userId: id },
    });
    console.log("current session is ", currentSession);
    if (!currentUser) {
      throw new Error("User not found");
    }
    if (currentUser.email !== email) {
      throw new Error("Email cannot be changed");
    }
    if (currentSession) {
      console.log(input);
      const result = await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          ...input.user,
        },
      });
      console.log(result);
    }
  },
});
