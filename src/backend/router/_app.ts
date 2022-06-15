import { createRouter } from "../createRouter";
import { authRouter } from "./auth";
import { squareRouter } from "./square";
import { userRouter } from "./user";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .merge(authRouter)
  .merge("user", userRouter)
  .merge("square", squareRouter);

export type AppRouter = typeof appRouter;
