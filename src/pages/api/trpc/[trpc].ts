import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/backend/router/_app";
import { createContext } from "@/backend/context";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("Something went wrong", error);
    }
  },
  batching: {
    enabled: true,
  },
});
