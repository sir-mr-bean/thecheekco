import Image from "next/image";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { CartState } from "../../../../context/Context";
import { addToCart } from "../../../../context/Reducer";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import * as gtag from "lib/gtag";
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router/_app";
import { inferRouterContext } from "@trpc/server";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";

const CategoryPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  console.log(props);
  const currentCategory = props.currentCategory;
  const router = useRouter();
  const query = router.query;
  const { cart, dispatch } = CartState();
  const products = props.products;

  const handleAdd = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      item: product,
      qty: 1,
    });
    gtag.event({
      action: "add_to_cart",
      category: "ecommerce",
      label: product.name,
      value: `/shop/${query.category}`,
    });
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-bg-tan shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={product?.image}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1 my-auto">
              <p className="mt-1 text-sm text-text-primary font-gothic">
                {product.name} added to cart.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-text-primary border-opacity-10">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:text-text-primary"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="max-w-screen min-h-screen border-2 flex justify-center">
        <div className="py-4 px-4 sm:py-10 sm:px-6 lg:px-8 bg-bg-lighttan mt-24 shadow-[0_0px_7px_1px_rgba(0,0,0,0.51)] w-full h-full mx-6 md:mx-16 sm:mx-20">
          <h2 className="text-4xl text-text-primary font-gothic font-extralight capitalize">
            {currentCategory.category_data.name}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-3 lg:grid-cols-4 xl:gap-x-10 ">
            {products &&
              products.map((product) => (
                <div key={product.id}>
                  <div className="relative">
                    <Link
                      href="/shop/[category]/[id]"
                      as={`/shop/${query.category}/${product.name
                        .replace(/ /g, "-")
                        .toLowerCase()}`}
                    >
                      <div className="relative w-full h-72 rounded-lg overflow-hidden cursor-pointer border-2 border-[#DBA37D]">
                        {product.image && (
                          <Image
                            layout="fill"
                            src={product?.image}
                            alt={product.name}
                            className="w-full h-full object-center object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="relative mt-4 space-y-2">
                      <Link
                        href="/shop/[category]/[id]"
                        as={`/shop/${query.category}/${product.name
                          .replace(/ /g, "-")
                          .toLowerCase()}`}
                      >
                        <h3 className="text-sm font-medium text-gray-900">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex text-header-brown">
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStar />
                        <BsStar />
                      </div>
                      <p className="relative text-lg font-bold text-black">
                        $
                        {(
                          product.variations?.[0]?.item_variation_data
                            ?.price_money?.amount / 100
                        ).toFixed(2)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {/* {product.color} */}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleAdd(product)}
                      className="relative flex bg-button rounded-2xl py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
                    >
                      Add to cart
                      <span className="sr-only">{product.name}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });
  const categoryQuery = await ssg.fetchQuery("categories");

  return {
    paths: categoryQuery.map((item) => ({
      params: {
        category: item.category_data.name
          .toString()
          .toLowerCase()
          .replaceAll(" ", "-"),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ category: string }>
) => {
  //console.log(context);
  const params = context.params?.category as string;
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });
  const categoryQuery = await ssg.fetchQuery("categories");

  const category = categoryQuery.find(
    (item) =>
      item.category_data.name.toLowerCase().replaceAll(" ", "-") === params
  );
  console.log(category);
  const products = await ssg.fetchQuery("products", {
    categoryId: params,
  });
  const productsByCategory = products.filter(
    (item) => item.category?.id === category?.id
  );
  console.log(productsByCategory.length);
  return {
    props: {
      currentCategory: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(productsByCategory)),
    },
  };
};
