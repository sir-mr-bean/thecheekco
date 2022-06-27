import { createRouter } from "../createRouter";
import { authRouter } from "./auth";
import { emailRouter } from "./email";
import { squareRouter } from "./square";
import { userRouter } from "./user";
import superjson from "superjson";
import { reviewsRouter } from "./reviews";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .transformer(superjson)
  .merge(authRouter)
  .merge("user", userRouter)
  .merge(squareRouter)
  .merge("email.", emailRouter)
  .merge("review.", reviewsRouter);

export type AppRouter = typeof appRouter;
