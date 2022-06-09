import * as trpc from "@trpc/server";
import { query } from "firebase/firestore";
import { z } from "zod";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
import { Category } from "@/types/Category";

export const appRouter = trpc.router().query("categories", {
  async resolve() {
    let categories: Category[] = [];

    let sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category`;

    let cursor = null;
    do {
      if (cursor != null)
        sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category&cursor=${cursor}`;
      const res = await fetch(sqCategories, {
        headers: {
          "Square-Version": "2022-05-12",
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverRuntimeConfig.squareAccessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch categories from Square, received status ${res.status}`
        );
      }
      const data = await res.json();
      //console.log(data);
      categories.push(...data.objects);
      cursor = data.cursor;
    } while (cursor != "" && cursor != null);

    return {
      categories,
    };
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
