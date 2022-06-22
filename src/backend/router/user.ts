import { createRouter } from "../createRouter";
import { z } from "zod";
import type { User, CartItem, Cart } from "@prisma/client";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());
type DateSchema = z.infer<typeof dateSchema>;

export const userRouter = createRouter()
  .mutation("updateUser", {
    input: z.object({
      email: z.string().optional(),
      user: z
        .object({
          id: z.string().optional(),
          createdAt: dateSchema as z.ZodType<DateSchema>,
          updatedAt: dateSchema as z.ZodType<DateSchema>,
          name: z.string().optional().nullish() as z.ZodType<string | null>,
          image: z.string().optional().nullish() as z.ZodType<string | null>,
          emailVerified: z.nullable(dateSchema) as z.ZodType<DateSchema | null>,
          password: z.nullable(z.string().optional()) as z.ZodType<
            string | null
          >,
          firstName: z.string().optional() as z.ZodType<string | null>,
          lastName: z.string().optional() as z.ZodType<string | null>,
          company: z.string().optional().nullish() as z.ZodType<string | null>,
          streetAddress: z.string().optional().nullish() as z.ZodType<
            string | null
          >,
          streetNumber: z.string().optional().nullish() as z.ZodType<
            string | null
          >,
          apartmentOrUnit: z.string().optional().nullish() as z.ZodType<
            string | null
          >,
          city: z.string().optional().nullish() as z.ZodType<string | null>,
          state: z.string().optional().nullish() as z.ZodType<string | null>,
          country: z.string().optional().nullish() as z.ZodType<string | null>,
          postalCode: z.string().optional().nullish() as z.ZodType<
            string | null
          >,
          email: z.string().optional(),
          phoneNumber: z.string().optional().nullish() as z.ZodType<
            string | null
          >,
          isAdmin: z.boolean().nullish() as z.ZodType<boolean>,
        })
        .nullish() as z.ZodType<User | null>,
    }),
    async resolve({ input, ctx }) {
      const { email, user } = input;
      const { prisma } = ctx;
      const { id } = user as User;
      const currentUser = await prisma.user.findUnique({
        where: { id },
      });
      const currentSession = await prisma.session.findFirst({
        where: { userId: id },
      });
      if (!currentUser) {
        throw new Error("User not found");
      }
      if (currentUser.email !== email) {
        throw new Error("Email cannot be changed");
      }
      if (currentSession) {
        const result = await prisma.user.update({
          where: {
            email: input.email,
          },
          data: {
            ...input.user,
          },
        });

        return {
          result: "success",
          user: result,
        };
      }
      return {
        result: "success",
        user: currentUser,
      };
    },
  })
  .mutation("addToCart", {
    input: z.object({
      userId: z.string(),
      productId: z.string(),
      quantity: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { userId, productId } = input;
      const { prisma } = ctx;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });
      if (!cart) {
        throw new Error("Cart not found");
      }

      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
        },
      });
      if (cartItem) {
        throw new Error("Product already in cart");
      }
      const result = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId as string,
          quantity: input.quantity as number,
        },
      });
      return result;
    },
  })
  .mutation("removeFromCart", {
    input: z.object({
      userId: z.string().optional(),
      productId: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const { userId, productId } = input;
      const { prisma } = ctx;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      const cart: Cart | null = await prisma.cart.findUnique({
        where: { userId },
      });
      if (!cart) {
        throw new Error("Cart not found");
      }
      const cartItem: CartItem | null = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });
      if (!cartItem) {
        throw new Error("Product not in cart");
      }
      const result = await prisma.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
      return result;
    },
  });
