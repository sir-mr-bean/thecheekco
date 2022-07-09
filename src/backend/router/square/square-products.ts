import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import { CatalogObject, Client, Environment } from "square";
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
        throw new TRPCError(e as TRPCError);
      }
      const filterUnderScoreProducts = productsArray.filter(
        (product) => !product.itemData?.name?.startsWith("_")
      );
      const productsResponse = filterUnderScoreProducts.filter(
        (product) =>
          !product.itemData?.variations?.[0]?.customAttributeValues?.[
            "Square:bc63391b-f09f-4399-846a-6721f81e4a4d"
          ]?.booleanValue === true
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
          const filterByCategory = products.filter(
            (product) =>
              input?.categoryIds?.includes(
                product.itemData?.categoryId as string
              ) || product.type === "IMAGE"
          );

          const productsResponse = filterByCategory.filter(
            (product) =>
              !product.itemData?.variations?.[0]?.customAttributeValues?.[
                "Square:bc63391b-f09f-4399-846a-6721f81e4a4d"
              ]?.booleanValue === true
          );

          return productsResponse;
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
      const itemsQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["IMAGE"],
      });

      const productResult = productsQuery.result;
      const itemsResult = itemsQuery?.result?.objects;

      return { products: productResult, items: itemsResult };
    },
  })
  .query("search-product-by-fullname", {
    input: z
      .object({
        productName: z.string(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      if (input?.productName) {
        const { productName } = input;

        const productsQuery = await catalogApi.searchCatalogObjects({
          objectTypes: ["ITEM", "CATEGORY", "IMAGE"],
        });
        console.log(productName);
        if (productsQuery?.result?.objects) {
          const products = productsQuery.result.objects;
          //console.log(products);
          console.log(products?.[2].itemData?.name?.toLowerCase().split(" "));
          const productsResults = products.filter(
            (product) =>
              (product.itemData?.variations?.[0]?.customAttributeValues?.[
                "Square:bc63391b-f09f-4399-846a-6721f81e4a4d"
              ]?.booleanValue !== true &&
                product.itemData?.name
                  ?.toLowerCase()
                  .replace(/ /g, "-")
                  .includes(productName?.toLowerCase().replace(/ /g, "-"))) ||
              product.type === "IMAGE" ||
              product.type === "CATEGORY"
          ) as CatalogObject[];
          const thisProduct: CatalogObject = productsResults.find(
            (product) => product.type === "ITEM"
          ) as CatalogObject;
          const ImageResults = productsResults.filter(
            (item) =>
              item.type === "ITEM" ||
              item.type === "CATEGORY" ||
              (item.type === "IMAGE" &&
                thisProduct?.itemData?.imageIds?.includes(item.id))
          ) as CatalogObject[];

          const categoryResults = ImageResults.filter(
            (item) =>
              item.type === "ITEM" ||
              item.type === "IMAGE" ||
              (item.type === "CATEGORY" &&
                thisProduct?.itemData?.categoryId === item.id)
          ) as CatalogObject[];

          return categoryResults;
        }
      } else {
        return null;
      }
    },
  })
  .query("search-product", {
    input: z
      .object({
        productName: z.string(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      if (input?.productName) {
        const { productName } = input;

        const productsQuery = await catalogApi.searchCatalogObjects({
          objectTypes: ["ITEM", "CATEGORY", "IMAGE"],
        });
        console.log(productName);
        if (productsQuery?.result?.objects) {
          const products = productsQuery.result.objects;
          //console.log(products);
          console.log(products?.[2].itemData?.name?.toLowerCase().split(" "));
          const productsResults = products.filter(
            (product) =>
              (product.itemData?.variations?.[0]?.customAttributeValues?.[
                "Square:bc63391b-f09f-4399-846a-6721f81e4a4d"
              ]?.booleanValue !== true &&
                product.itemData?.name
                  ?.toLowerCase()
                  .indexOf(productName.toLowerCase()) !== -1) ||
              product.type === "IMAGE" ||
              product.type === "CATEGORY"
          ) as CatalogObject[];
          const thisProduct: CatalogObject = productsResults.find(
            (product) => product.type === "ITEM"
          ) as CatalogObject;
          const ImageResults = productsResults.filter(
            (item) =>
              item.type === "ITEM" ||
              item.type === "CATEGORY" ||
              (item.type === "IMAGE" &&
                thisProduct?.itemData?.imageIds?.includes(item.id))
          ) as CatalogObject[];

          const categoryResults = ImageResults.filter(
            (item) =>
              item.type === "ITEM" ||
              item.type === "IMAGE" ||
              (item.type === "CATEGORY" &&
                thisProduct?.itemData?.categoryId === item.id)
          ) as CatalogObject[];

          return categoryResults;
        }
      } else {
        return null;
      }
    },
  })
  // .query("products", {
  //   input: z
  //     .object({
  //       categoryId: z.string().nullish(),
  //     })
  //     .nullish(),
  //   async resolve({ input, ctx }) {
  //     const productsQuery = await catalogApi.searchCatalogObjects({
  //       objectTypes: ["ITEM", "CATEGORY"],
  //       includeRelatedObjects: true,
  //     });

  //     if (input?.categoryId) {
  //       const productsResponse = productsQuery.result.objects?.filter(
  //         (product) =>
  //           product?.itemData?.categoryId?.includes(
  //             input?.categoryId as string
  //           ) && product?.type === "ITEM"
  //       );
  //       const products = productsResponse?.map((item) => {
  //         const currentImage = productsQuery.result?.relatedObjects?.find(
  //           (item) => item.id === item.itemData?.itemIds?.[0]
  //         );
  //         const categories = productsQuery.result?.objects?.filter(
  //           (category) => category.type === "CATEGORY"
  //         );

  //         const currentCategory = productsQuery.result?.objects?.find(
  //           (category) =>
  //             category.type === "CATEGORY" &&
  //             category.id === item?.itemData?.categoryId
  //         );

  //         let isAllNatural = false;

  //         if (item?.itemData?.variations?.[0].customAttributeValues) {
  //           const keys = Object.keys(
  //             item?.itemData.variations?.[0]?.customAttributeValues
  //           );
  //           if (keys.length) {
  //             const allNaturalAttr = keys?.some((key) => {
  //               return (
  //                 item?.itemData?.variations?.[0]?.customAttributeValues?.[key]
  //                   ?.name === "All-Natural" &&
  //                 item?.itemData.variations?.[0].customAttributeValues?.[key]
  //                   ?.booleanValue === true
  //               );
  //             });
  //             isAllNatural = allNaturalAttr;
  //           }
  //         }

  //         return {
  //           id: item.id,
  //           name: item.itemData?.name,
  //           description: item.itemData?.description,
  //           category: currentCategory,
  //           price: item?.itemData?.variations?.[0],
  //           item: currentImage?.itemData?.url,
  //           isAllNatural,
  //         };
  //       });
  //       return products;
  //     } else {
  //       return productsQuery;
  //     }
  //   },
  // })
  .query("get-product-subcategories", {
    async resolve({ input, ctx }) {
      const attributesQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["CUSTOM_ATTRIBUTE_DEFINITION"],
        includeRelatedObjects: true,
      });
      const allAttributes = attributesQuery?.result?.objects;
      const subCategoryAttribute = allAttributes?.find(
        (attribute) =>
          attribute?.customAttributeDefinitionData?.name === "Sub-Category"
      );

      return subCategoryAttribute;
    },
  });
