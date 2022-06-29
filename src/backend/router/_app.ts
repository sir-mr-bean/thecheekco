import { createRouter } from "../createRouter";
import { authRouter } from "./auth";
import { emailRouter } from "./email";
import { squareRouter } from "./square";
import { userRouter } from "./user";
import superjson from "superjson";
import { reviewsRouter } from "./reviews";
import { squareOrderRouter } from "./square/square-order";
import { squarePaymentRouter } from "./square/square-payment";
import { squareProductRouter } from "./square/square-products";

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
  .merge("square-customer.", squareRouter)
  .merge("square-order.", squareOrderRouter)
  .merge("square-payment.", squarePaymentRouter)
  .merge("square-products.", squareProductRouter)
  .merge("square-categories.", squareRouter)
  .merge("email.", emailRouter)
  .merge("review.", reviewsRouter);

export type AppRouter = typeof appRouter;
