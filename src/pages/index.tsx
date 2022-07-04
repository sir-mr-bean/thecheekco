import { CartState } from "../../context/Cart/Context";
import { Dispatch } from "react";
import Image from "next/image";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import toast from "react-hot-toast";
import superjson from "superjson";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router/_app";
import { inferRouterContext } from "@trpc/server";
import { trpc } from "@/utils/trpc";
import { CatalogObject } from "square";
import { CartObject } from "@/types/CartObject";
import AllNatural from "@/components/Homepage/AllNatural";
import { ProductReview } from "@prisma/client";
import Banner from "@/components/Homepage/Banner/Banner";
import CheekyBox from "@/components/Homepage/CheekyBox";
import HowItBegan from "@/components/Homepage/HowItBegan";
import Videos from "@/components/Homepage/Videos";

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data: categoriesData } = trpc.useQuery(
    ["square-categories.all-categories"],
    {
      context: {
        skipBatch: true,
      },
    }
  );
  const { data: productsData } = trpc.useQuery([
    "square-products.all-products",
  ]);
  const {
    cart,
    dispatch,
  }: {
    cart: CartObject[];
    dispatch: Dispatch<{
      type: string;
      item?: CartObject;
      quantity?: number;
      productImage?: string;
    }>;
  } = CartState();
  const { data: productReviewsData } = trpc.useQuery(
    [
      "review.fetch-reviews",
      {
        productIds: productsData?.map(
          (product) => product.id as string
        ) as string[],
      },
    ],
    {
      enabled: !!productsData,
    }
  );

  const handleAdd = (product: CatalogObject) => {
    const productImage = productsData?.find(
      (p) => p.type === "IMAGE" && product?.itemData?.imageIds?.includes(p.id)
    );
    dispatch({
      type: "ADD_TO_CART",
      item: product as CartObject,
      quantity: 1,
      productImage: productImage?.imageData?.url,
    });
    toast.custom((t) => {
      return (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave after:opacity-0"
          } max-w-md w-full bg-bg-tan shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 shadow-text-primary`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Image
                  className="w-24 h-24 rounded-full"
                  height={50}
                  width={50}
                  objectFit="cover"
                  src={
                    productImage?.imageData?.url ||
                    "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                  }
                  alt={product.itemData?.name}
                />
              </div>
              <div className="ml-3 flex-1 my-auto">
                <p className="mt-1 text-sm text-text-primary font-gothic">
                  1 {product.itemData?.name} added to cart.
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
      );
    });
  };

  return (
    <div className="overflow-x-hidden">
      <div>
        <main>
          <Banner />
          <CheekyBox />
          <AllNatural
            categoriesData={categoriesData as CatalogObject[]}
            productsData={productsData as CatalogObject[]}
            handleAdd={handleAdd}
            productReviewsData={productReviewsData as ProductReview[]}
          />
          {/* Featured section */}
          <HowItBegan />
          <Videos />

          {/* Collection section */}

          {/* Featured section */}
        </main>
      </div>
    </div>
  );
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });

  await ssg.fetchQuery("square-categories.all-categories");
  await ssg.fetchQuery("square-products.all-products");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 900,
  };
};
