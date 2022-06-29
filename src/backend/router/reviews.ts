import { z } from "zod";
import { createRouter } from "../createRouter";

export const reviewsRouter = createRouter()
  .query("fetch-reviews", {
    input: z.object({
      productIds: z.array(z.string()),
    }),
    async resolve({ input, ctx }) {
      const { productIds } = input;
      const { prisma } = ctx;
      const reviews = await prisma.productReview.findMany({});
      const productReviews = reviews.filter((review) =>
        productIds.includes(review.productId)
      );
      return productReviews;
    },
  })
  .query("reviewed-by", {
    input: z.object({
      userIds: z.array(z.string()).nullish(),
    }),
    async resolve({ input, ctx }) {
      const { userIds } = input;
      const { prisma } = ctx;
      if (userIds) {
        const reviewers = await prisma.user.findMany({
          where: { id: { in: userIds } },
        });
        if (!reviewers) {
          throw new Error("User not found");
        }
        return reviewers;
      } else {
        const reviewers = await prisma.user.findMany({});
        if (!reviewers) {
          throw new Error("User not found");
        }
        return reviewers;
      }
    },
  })
  .mutation("create-review", {
    input: z.object({
      productId: z.string(),
      userId: z.string(),
      rating: z.number(),
      comment: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { productId, userId, rating, comment } = input;
      const { prisma } = ctx;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const result = await prisma.productReview.create({
        data: {
          productId: productId as string,
          userId: userId as string,
          rating: rating as number,
          comment: comment as string,
        },
      });
      return result;
    },
  });