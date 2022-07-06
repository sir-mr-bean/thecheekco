import { createRouter } from "../createRouter";
import { authRouter } from "./auth";
import { emailRouter } from "./email";
import { userRouter } from "./user";
import superjson from "superjson";
import { reviewsRouter } from "./reviews";
import { squareOrderRouter } from "./square/square-order";
import { squarePaymentRouter } from "./square/square-payment";
import { squareProductRouter } from "./square/square-products";
import { squareCategoriesRouter } from "./square/square-categories";
import { squareCustomerRouter } from "./square/square-customer";
import { cheekyBoxFormRouter } from "./form/cheekyboxForm";
import { contactUsRouter } from "./form/contactUsForm";

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
  .merge("square-customer.", squareCustomerRouter)
  .merge("square-order.", squareOrderRouter)
  .merge("square-payment.", squarePaymentRouter)
  .merge("square-products.", squareProductRouter)
  .merge("square-categories.", squareCategoriesRouter)
  .merge("email.", emailRouter)
  .merge("review.", reviewsRouter)
  .merge("cheekybox-form.", cheekyBoxFormRouter)
  .merge("contact-us-form.", contactUsRouter);

export type AppRouter = typeof appRouter;
