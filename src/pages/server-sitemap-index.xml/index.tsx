import { appRouter } from "@/backend/router/_app";
import { createSSGHelpers } from "@trpc/react/ssg";
import { inferRouterContext } from "@trpc/server";
import { getServerSideSitemap } from "next-sitemap";
import superjson from "superjson";

export const getServerSideProps = async (context) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });
  const productsQuery = await ssg.fetchQuery("square-products.all-products");
  const categoryQuery = await ssg.fetchQuery(
    "square-categories.all-categories"
  );
  const paths = productsQuery
    .filter((product) => product.type === "ITEM")
    .filter(
      (product) =>
        product.itemData?.categoryId &&
        product.itemData.categoryId !== "" &&
        product.itemData.categoryId !== undefined &&
        product.itemData.categoryId !== null &&
        product.itemData?.name?.replace(/ /g, "-").toLowerCase() !==
          "venue-hire"
    )
    .map((product) => ({
      path: `${process.env.API_URL}/shop/${categoryQuery
        ?.find((category) => category.id === product.itemData?.categoryId)
        ?.categoryData?.name?.replace(/ /g, "-")
        .toLowerCase()}/${product.itemData?.name?.replace(/ /g, "-")}`,
    }));

  const newsSitemaps = paths.map((item) => ({
    loc: item.path,
    lastmod: new Date().toISOString(),
  }));

  const fields = [...newsSitemaps];

  return getServerSideSitemap(context, fields);
};

export default function Site() {}
