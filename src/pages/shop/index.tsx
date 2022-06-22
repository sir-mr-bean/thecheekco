import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Category, Product } from "@/types/Product";
import {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router/_app";
import { inferRouterContext } from "@trpc/server";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import { CatalogObject, SearchCatalogObjectsResponse } from "square";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default function shop(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const categoriesQuery = trpc.useQuery(["all-categories"]);
  const { data: categories } = categoriesQuery;
  const { data: products } = trpc.useQuery(["all-products"]);

  return (
    <div className="mx-2 sm:mx-10 px-4 bg-white shadow-md shadow-black text-text-primary font-gothic">
      <div className="flex flex-wrap justify-between">
        <div className="w-full">
          <div className="flex flex-wrap justify-between divide-y">
            {products &&
              categories &&
              categories?.map((category, i) => (
                <div key={i} className="w-full sm:px-4 sm:mx-10">
                  <div className="relative">
                    <Link
                      href="/shop/[category]"
                      as={`/shop/${category.categoryData?.name
                        ?.replace(/ /g, "-")
                        .toLowerCase()}`}
                    >
                      <a className="block w-full md:w-1/2 px-4">
                        <div className="relative py-5 space-y-2">
                          <h3 className="text-2xl font-medium text-text-primary">
                            {category.categoryData?.name}
                          </h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-wrap md:gap-1 w-full justify-start sm:justify-start xl:justify-evenly items-center">
                    {products
                      ?.filter(
                        (item) => item.itemData?.categoryId === category.id
                      )
                      ?.map((product, i) => {
                        const productImage = products?.find(
                          (p) =>
                            p.type === "IMAGE" &&
                            product.itemData?.imageIds?.includes(p.id)
                        );
                        while (i < 6)
                          return (
                            <div
                              key={i}
                              className="w-fit h-fit space-y-1 px-2 lg:px-4"
                            >
                              <div className="relative">
                                <Link
                                  href="/shop/[category]/[id]"
                                  as={`/shop/${category.categoryData?.name
                                    ?.replace(/ /g, "-")
                                    .toLowerCase()}/${product.itemData?.name
                                    ?.replace(/ /g, "-")
                                    .toLowerCase()}`}
                                >
                                  <a className="px-4 ">
                                    <div className="flex sm:flex-col justify-between items-start space-x-2">
                                      <div className="relative w-64 min-w-xl">
                                        <Image
                                          src={
                                            productImage?.imageData?.url ||
                                            "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                          }
                                          alt={product.itemData?.name}
                                          width={1920}
                                          height={1080}
                                          layout="responsive"
                                          className="object-center object-cover rounded-lg"
                                        />
                                      </div>
                                      <div className="relative mt-4 flex flex-col sm:flex-row items-center justify-between w-full">
                                        <h1 className="text-sm font-medium sm:whitespace-nowrap">
                                          {product.itemData?.name}
                                        </h1>
                                        <h3 className="text-xs font-medium sm:whitespace-nowrap pr-2">
                                          $
                                          {(
                                            Number(
                                              product?.itemData?.variations?.[0]
                                                ?.itemVariationData?.priceMoney
                                                ?.amount
                                            ) / 100
                                          ).toFixed(2)}
                                        </h3>
                                      </div>
                                    </div>
                                  </a>
                                </Link>
                              </div>
                            </div>
                          );
                      })}
                    <div className="w-full flex justify-end items-center py-1 cursor-pointer">
                      <Link
                        href="/shop/[category]"
                        as={`/shop/${category.categoryData?.name
                          ?.replace(/ /g, "-")
                          .toLowerCase()}`}
                      >
                        <span className="">
                          Browse all {category.categoryData?.name}
                          <span aria-hidden="true"> &rarr;</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-wrap justify-between"></div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });

  await ssg.fetchQuery("all-categories");
  await ssg.fetchQuery("all-products");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 900,
  };
};
