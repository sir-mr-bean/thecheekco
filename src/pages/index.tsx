import { CartState } from "../../context/Cart/Context";
import { Dispatch } from "react";
import Image from "next/image";
import {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import {
  BsHeartFill,
  BsEmojiHeartEyesFill,
  BsFillCalendarCheckFill,
} from "react-icons/bs";
import { FaKissWinkHeart, FaShippingFast } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import toast from "react-hot-toast";
import superjson from "superjson";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router/_app";
import { inferRouterContext } from "@trpc/server";
import { trpc } from "@/utils/trpc";
import { CatalogObject } from "square";
import { CartObject } from "@/types/CartObject";
import accessories from "../../public/images/Homepage/accessories.png";
import bath from "../../public/images/Homepage/bath.png";
import gift_sets from "../../public/images/Homepage/gift_sets.png";
import home_decor from "../../public/images/Homepage/home_decor.png";
import shower from "../../public/images/Homepage/shower.png";
import skin_care from "../../public/images/Homepage/skin_care.png";
import bumlogo from "../../public/images/Homepage/bumlogo.png";
import AllNatural from "@/components/Homepage/AllNatural";
import { ProductReview } from "@prisma/client";
import CheekyBox from "@/components/Homepage/CheekyBox";
import HowItBegan from "@/components/Homepage/HowItBegan";
import Videos from "@/components/Homepage/Videos";

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data: categoriesData } = trpc.useQuery(["all-categories"], {
    context: {
      skipBatch: true,
    },
  });
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

  const Icon = (iconName: string) => {
    switch (iconName) {
      case "FaKissWinkHeart":
        return <FaKissWinkHeart size={25} />;
      case "FaShippingFast":
        return <FaShippingFast size={25} />;
      case "HiCursorClick":
        return <HiCursorClick size={25} />;
      case "BsHeartFill":
        return <BsHeartFill size={25} />;
      case "BsEmojiHeartEyesFill":
        return <BsEmojiHeartEyesFill size={25} />;
      case "BsFillCalendarCheckFill":
        return <BsFillCalendarCheckFill size={25} />;
      default:
        return <div>{iconName}</div>;
    }
  };

  const offers = [
    {
      name: "Free Shipping on orders over $100",
      icon: "FaShippingFast",

      href: "#",
    },
    {
      name: "Check out our in-store events",
      icon: "BsFillCalendarCheckFill",

      href: "#",
    },
    {
      name: "Click & Collect",
      icon: "HiCursorClick",

      href: "/click-and-collect",
    },
  ];

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
    if (window !== undefined) {
    }
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
        <nav
          aria-label="Offers"
          className="order-last lg:order-first my-1 sm:my-3 relative z-20"
        >
          <div className="max-w-5xl mx-auto lg:px-8">
            <ul
              role="list"
              className="grid grid-cols-3  divide-text-primary divide-x"
            >
              {offers.map((offer) => (
                <li key={offer.name} className="flex flex-col ">
                  <a
                    href={offer.href}
                    className="relative flex-1 flex flex-col justify-between pt-3 sm:py-2 px-2 text-center space-y-2"
                  >
                    <div className="text-text-primary mx-auto  h-6 w-6 flex items-center justify-center ">
                      {Icon(`${offer.icon}`)}
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm text-text-secondary">
                      {offer.name}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="relative z-0 pt-4 font-gothic font-normal text-white sm:mx-32 xl:mx-72 ">
          <div className="flex flex-col mx-4 h-fit space-y-2 sm:space-y-6 w-fit">
            <div className="flex items-start justify-center w-full space-x-2 sm:space-x-6">
              <div className="flex flex-col items-center justify-start w-full space-y-2 sm:space-y-6 ">
                <div className="bg-button rounded-lg flex flex-col items-center justify-center p-2 sm:py-6 lg:py-1.5 w-fit shadow-slate-500 shadow-sm">
                  <div className="flex flex-row items-center justify-center h-14 sm:h-16 py-1">
                    <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl text-center h-fit">
                      More
                    </span>
                    <div className="block w-16 sm:w-24 lg:w-32">
                      <Image
                        src={bumlogo}
                        width={75}
                        height={75}
                        layout="responsive"
                        priority
                      />
                    </div>
                    <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl text-left h-fit whitespace-nowrap">
                      than
                    </span>
                  </div>
                  <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl h-fit text-center xl:px-48">
                    your bathroom can handle!
                  </span>
                  <span className="text-base lg:text-2xl text-center font-thin pt-1 sm:pt-6 px-0 sm:px-16 xl:px-12">
                    Handmade in our shop in Cairns, all our bath & body products
                    are created by us and tested on us.
                  </span>
                </div>

                <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg w-full h-40 lg:h-64 relative">
                  <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                    <div className="py-1 bg-button border border-transparent rounded-md whitespace-nowrap shadow-sm shadow-text-primary">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 px-2 sm:px-4">
                          <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white uppercase">
                            Skin Care
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Image
                    src={skin_care}
                    alt="Shop Skin Care"
                    objectFit="cover"
                    objectPosition="center"
                    layout="fill"
                    className="rounded-md"
                    priority
                  />
                </div>
                <div className="w-full flex items-center justify-center h-full">
                  <div className="w-full border border-text-primary rounded-lg h-32 lg:h-72 mr-2 sm:mr-6 relative">
                    <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                      <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 px-2 sm:px-4">
                            <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                              Accessories
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Image
                      src={accessories}
                      alt="Accessories"
                      objectFit="cover"
                      objectPosition="center"
                      layout="fill"
                      className="rounded-md"
                      priority
                    />
                  </div>
                  <div className="w-full border border-text-primary rounded-lg h-32 lg:h-72 relative">
                    <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                      <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 px-2 sm:px-4">
                            <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                              Gift Sets
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Image
                      src={gift_sets}
                      alt="Shop Gift Sets"
                      objectFit="cover"
                      objectPosition="center"
                      layout="fill"
                      className="rounded-md"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="w-1/3 space-y-2 sm:space-y-6 box-content">
                <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg lg:min-w-[250px] h-[260px] sm:h-80 lg:h-[450px] relative box-content">
                  <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                    <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 px-2 sm:px-4">
                          <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                            Bath
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Image
                    src={bath}
                    alt="Shop Bath"
                    objectFit="cover"
                    objectPosition="center"
                    layout="fill"
                    className="rounded-md"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg lg:min-w-[250px] h-[265px] sm:h-80 lg:h-[400px] relative box-content">
                  <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                    <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 px-2 sm:px-4">
                          <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                            Shower
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Image
                    src={shower}
                    alt="Shop Shower"
                    objectFit="cover"
                    objectPosition="center"
                    layout="fill"
                    className="rounded-md h-full w-full"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="w-full border-text-primary border rounded-lg h-36 sm:h-48 lg:h-72 relative">
              <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 px-2 sm:px-4">
                      <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                        Home Decor
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src={home_decor}
                alt="Shop Home Decor"
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                className="rounded-md "
                priority
              />
            </div>
          </div>
        </div>

        <main>
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

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });

  await ssg.fetchQuery("all-categories");
  await ssg.fetchQuery("square-products.all-products");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 900,
  };
};
