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
  responseMeta({ ctx, paths, type, errors }) {
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic =
      paths && paths.every((path) => path.includes("categories"));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === "query";

    if (ctx?.res && allPublic && allOk && isQuery) {
      // cache request for 1 day + revalidate once every hour
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      const ONE_HOUR_IN_SECONDS = 60 * 60;
      return {
        headers: {
          "cache-control": `s-maxage=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
