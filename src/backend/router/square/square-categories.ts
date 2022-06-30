import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import { Client, Environment } from "square";

const { catalogApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareCategoriesRouter = createRouter()
  .transformer(superjson)
  .query("all-categories", {
    async resolve({ input, ctx }) {
      const categoryQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["CATEGORY"],
      });
      const categories = categoryQuery.result.objects;
      const categoriesResult = categories?.filter(
        (category) => !category?.categoryData?.name?.startsWith("_")
      );
      return categoriesResult;
    },
  });
