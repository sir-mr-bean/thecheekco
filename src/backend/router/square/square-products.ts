import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";

import {
  ApiResponse,
  CatalogObject,
  Client,
  CreateOrderResponse,
  Environment,
} from "square";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const { catalogApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareProductRouter = createRouter()
  .transformer(superjson)
  .query("all-products", {
    async resolve() {
      const productsArray: CatalogObject[] = [];
      try {
        let listProductsResponse = await catalogApi.listCatalog(
          undefined,
          "item,image"
        );
        productsArray.push(...(listProductsResponse.result.objects as never[]));
        let cursor = listProductsResponse.result.cursor;
        do {
          if (cursor != null)
            listProductsResponse = await catalogApi.listCatalog(
              cursor,
              "item,image"
            );
          productsArray.push(
            ...(listProductsResponse.result.objects as never[])
          );
          cursor = listProductsResponse.result.cursor;
        } while (cursor != "" && cursor != null);
      } catch (e) {
        console.log(e);
        throw new TRPCError(e.message);
      }
      const productsResponse = productsArray.filter(
        (product) => !product.itemData?.name?.startsWith("_")
      );
      return productsResponse;
    },
  })
  .query("search-products", {
    input: z.object({
      categoryIds: z.array(z.string()).nullish(),
    }),
    async resolve({ input, ctx }) {
      const productsQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["ITEM", "CATEGORY", "IMAGE"],
        includeRelatedObjects: true,
      });
      if (input?.categoryIds) {
        if (productsQuery?.result?.objects) {
          const products = productsQuery.result.objects;
          const productsResult = products.filter(
            (product) =>
              input?.categoryIds?.includes(
                product.itemData?.categoryId as string
              ) || product.type === "IMAGE"
          );
          return productsResult;
        }
      } else {
        return productsQuery?.result?.objects;
      }
    },
  })
  .query("search-products-by-ids", {
    input: z.object({
      productIds: z.array(z.string()).nullish(),
    }),
    async resolve({ input, ctx }) {
      const productsQuery = await catalogApi.batchRetrieveCatalogObjects({
        objectIds: input?.productIds as string[],
        includeRelatedObjects: true,
      });
      const imagesQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["IMAGE"],
      });

      const productResult = productsQuery.result;
      const imagesResult = imagesQuery?.result?.objects;

      return { products: productResult, images: imagesResult };
    },
  })
  .query("search-product", {
    input: z.object({
      productName: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { productName } = input;
      const productsQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["ITEM", "CATEGORY", "IMAGE"],
        includeRelatedObjects: true,
      });
      if (productsQuery?.result?.objects) {
        const products = productsQuery.result.objects;
        const productsResults = products.filter(
          (product) =>
            product.itemData?.name?.toLowerCase().replaceAll(" ", "-") ===
              productName.toLowerCase() || product.type === "IMAGE"
        );
        const singleProduct = productsResults.find(
          (product) => product.type === "ITEM"
        );
        const productsResult = productsResults.filter(
          (product) =>
            product.id === singleProduct?.id ||
            (product.type === "IMAGE" &&
              product.id === singleProduct?.itemData?.imageIds?.[0])
        );

        return productsResult;
      }
    },
  })
  .query("products", {
    input: z
      .object({
        categoryId: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const productsQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["ITEM", "CATEGORY"],
        includeRelatedObjects: true,
      });

      if (input?.categoryId) {
        const productsResponse = productsQuery.result.objects?.filter(
          (product) =>
            product?.itemData?.categoryId?.includes(
              input?.categoryId as string
            ) && product?.type === "ITEM"
        );
        const products = productsResponse?.map((item) => {
          const currentImage = productsQuery.result?.relatedObjects?.find(
            (image) => image.id === item.itemData?.imageIds?.[0]
          );
          const categories = productsQuery.result?.objects?.filter(
            (category) => category.type === "CATEGORY"
          );

          const currentCategory = productsQuery.result?.objects?.find(
            (category) =>
              category.type === "CATEGORY" &&
              category.id === item?.itemData?.categoryId
          );

          let isAllNatural = false;

          if (item?.itemData?.variations?.[0].customAttributeValues) {
            const keys = Object.keys(
              item?.itemData.variations?.[0]?.customAttributeValues
            );
            if (keys.length) {
              const allNaturalAttr = keys?.some((key) => {
                return (
                  item?.itemData?.variations?.[0]?.customAttributeValues?.[key]
                    ?.name === "All-Natural" &&
                  item?.itemData.variations?.[0].customAttributeValues?.[key]
                    ?.booleanValue === true
                );
              });
              isAllNatural = allNaturalAttr;
            }
          }

          return {
            id: item.id,
            name: item.itemData?.name,
            description: item.itemData?.description,
            category: currentCategory,
            price: item?.itemData?.variations?.[0],
            image: currentImage?.imageData?.url,
            isAllNatural,
          };
        });
        return products;
      } else {
        return productsQuery;
      }
    },
  });