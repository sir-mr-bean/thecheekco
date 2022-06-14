import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";

export const authRouter = createRouter()
  .query("next-auth.getSession", {
    async resolve({ ctx }) {
      return ctx.session;
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  });
