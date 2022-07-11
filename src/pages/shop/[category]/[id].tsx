import { Dispatch, Fragment, useEffect, useRef, useState } from "react";
import { WishlistState } from "@/context/Wishlist/Context";
import Image from "next/image";
import showdown from "showdown";
import ReactHtmlParser from "react-html-parser";
import { CartState } from "@/context/Cart/Context";
import toast from "react-hot-toast";
import {
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router/_app";
import { inferRouterContext } from "@trpc/server";
import superjson from "superjson";
import { useRouter } from "next/router";
import { CatalogObject } from "square";
import { trpc } from "@/utils/trpc";
import { WishlistObject } from "@/types/WishlistObject";
import FavouriteButton from "@/components/FavouriteButton/FavouriteButton";
import Stars from "@/components/Reviews/Stars";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NewReview from "@/components/Reviews/NewReview/NewReview";
import moment from "moment";
import Head from "next/head";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const tabs = [
  {
    index: 1,
    name: "additionalinfo",
  },
  {
    index: 2,
    name: "reviews",
  },
];

const Markdown = ({ content }: { content: string }) => {
  var converter = new showdown.Converter();
  var html = converter.makeHtml(content);
  return (
    <div className="bg-transparent py-1 font-gothic text-text-primary">
      {ReactHtmlParser(html)}
    </div>
  );
};

type CartObject = CatalogObject & {
  quantity?: number;
  productImage?: string;
};

const Product = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const quantity = useRef<HTMLSelectElement>(null);
  const {
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
  const {
    wishlist,
    dispatch: wishlistDispatch,
  }: {
    wishlist: WishlistObject[];
    dispatch: Dispatch<{
      type: string;
      item?: WishlistObject;
    }>;
  } = WishlistState();
  const router = useRouter();
  const reviewInputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const currentPath = router.asPath;
  const [openTab, setOpenTab] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  // const { data: productQuery } = trpc.useQuery([
  //   "square-products.search-product",
  //   { productName: router.query?.id as string },
  // ]);
  const productQuery = props.productQuery as CatalogObject[];

  const product = productQuery?.find((product) => product.type === "ITEM");
  const image = productQuery?.find((product) => product.type === "IMAGE");
  const utils = trpc.useContext();
  const reviewMutation = trpc.useMutation(["review.create-review"], {
    onSuccess(input) {
      utils.invalidateQueries(["review.fetch-reviews"]);
    },
  });
  const { data: reviews, status: reviewQueryStatus } = trpc.useQuery(
    [
      "review.fetch-reviews",
      {
        productIds: [product?.id as string],
      },
    ],
    {
      enabled: !!product?.id,
    }
  );
  const { data: reviewers, status: reviewerQueryStatus } = trpc.useQuery(
    [
      "review.reviewed-by",
      {
        userIds: reviews && reviews.map((review) => review.userId as string),
      },
    ],
    {
      enabled: !!reviews,
    }
  );
  const review = reviews?.find((r) => r.productId === product?.id);
  console.log(router);
  useEffect(() => {
    if (reviews) {
      const ratings = reviews.map((r) => r.rating);
      const average =
        ratings.reduce((a, b) => a + parseFloat(b.toString()), 0) /
        ratings.length;
      setAverageRating(average);
    }
  }, [reviews]);

  const handleNewReview = () => {
    if (session) {
      reviewMutation.mutate(
        {
          productId: product?.id as string,
          userId: session.user.id,
          rating: rating,
          comment: reviewInputRef.current?.value as string,
        },
        {
          onSuccess(input) {
            // set value of  reviewInputRef to empty string
            reviewInputRef.current &&
              reviewInputRef.current.value &&
              (reviewInputRef.current.value = "");
            setRating(0);
            toast.success("Review submitted successfully");
          },
          onError(error) {
            toast.error(error.message);
          },
        }
      );
    } else {
      toast.error("You must be logged in to submit a review");
    }
  };
  const handleAdd = (product: CatalogObject) => {
    const productImage = productQuery?.find(
      (p) => p.type === "IMAGE" && product.itemData?.imageIds?.includes(p.id)
    );
    dispatch({
      type: "ADD_TO_CART",
      item: product,
      quantity: parseInt(quantity?.current?.value as string),
      productImage: productImage?.imageData?.url,
    });
    if (window !== undefined) {
    }
    toast.custom((t) => {
      return (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave after:opacity-0"
          } pointer-events-auto flex w-full max-w-md rounded-lg bg-bg-tan shadow-lg shadow-text-primary ring-1 ring-black ring-opacity-5`}
        >
          <div className="w-0 flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Image
                  className="h-24 w-24 rounded-full"
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
              <div className="my-auto ml-3 flex-1">
                <p className="mt-1 font-gothic text-sm text-text-primary">
                  {quantity?.current?.value} {product.itemData?.name} added to
                  cart.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-text-primary border-opacity-10">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-text-primary focus:text-text-primary focus:outline-none focus:ring-2"
            >
              Close
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="max-w-screen">
      <Head>
        <title>The Cheek Co. - {product?.itemData?.name}</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {product && (
        <div className="font-gothic text-text-primary">
          <div className="mx-auto space-y-6 px-4 pt-10 pb-16 sm:px-6 sm:pb-12 lg:max-w-5xl lg:px-8 ">
            {/* Product */}
            <div className="flex flex-col items-stretch  justify-items-stretch sm:flex-row sm:space-x-6">
              {/* Product image */}

              <div className="relative mx-auto mb-6 h-96 w-full sm:mb-0 sm:h-auto sm:w-2/3">
                <Image
                  priority
                  layout="fill"
                  objectFit="cover"
                  height={1920}
                  width={1080}
                  src={
                    image?.imageData?.url ||
                    "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                  }
                  alt={product?.itemData?.name}
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Product details */}
              <div className="flex w-full max-w-xl flex-col justify-around rounded-lg border bg-white px-4 sm:max-w-sm sm:px-10">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex w-full items-center justify-center">
                    <h1 className="px-3 pt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-2xl">
                      {product?.itemData?.name}
                    </h1>
                    <div className="pt-3">
                      <FavouriteButton
                        product={product}
                        image={image?.imageData?.url as string}
                        styles={{
                          position: "absolute",
                          top: "-30px",
                          right: "-30px",
                        }}
                      />
                    </div>
                  </div>

                  <h2 id="information-heading" className="sr-only">
                    Product information
                  </h2>
                  <div>
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      <Stars review={review} />
                    </div>
                  </div>
                </div>

                <p className="mt-6 p-3 text-center text-text-secondary">
                  {
                    product.itemData?.variations?.[0]?.customAttributeValues?.[
                      "Square:3b3f304f-3773-471a-a12d-48e58776375b"
                    ]?.stringValue
                  }
                </p>
                <div className="flex items-center justify-between space-x-10">
                  <button
                    onClick={() => handleAdd(product)}
                    type="button"
                    className="mt-3 flex items-center justify-center rounded-md border border-transparent bg-button py-3 px-8 text-base font-medium uppercase text-white hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Add to cart
                  </button>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-text-secondary"
                    >
                      Quantity
                    </label>
                    <select
                      ref={quantity}
                      id="quantity"
                      name="quantity"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-4 text-base text-text-primary focus:border-text-primary focus:outline-none focus:ring-text-primary sm:text-sm"
                      defaultValue={1}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex w-full items-center justify-evenly border-t border-gray-200 pt-5">
                  <span className="text-2xl text-text-primary">
                    $
                    {(
                      Number(
                        product?.itemData?.variations?.[0]?.itemVariationData
                          ?.priceMoney?.amount
                      ) / 100
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="mt-5 flex w-full items-center justify-center border-t border-gray-200 py-1">
                  <ul role="list" className="flex items-center space-x-6">
                    <li>
                      <a
                        target={"_blank"}
                        href={`https://www.facebook.com/sharer/sharer.php?u=https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`}
                        className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-[#4267B2]"
                      >
                        <span className="sr-only">Share on Facebook</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>

                    <li>
                      <a
                        target={"_blank"}
                        href={`https://twitter.com/intent/tweet?text=${product?.itemData?.name}&url=https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`}
                        className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-[#1DA1F2]"
                      >
                        <span className="sr-only">Share on Twitter</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-center rounded-lg bg-white ">
              <div className="flex w-full  flex-row items-center justify-center px-4 py-4 pb-5 lg:col-span-4 lg:mt-0">
                <div
                  onClick={() => {
                    setOpenTab(1);
                  }}
                  className={
                    openTab === 1
                      ? `w-full cursor-pointer select-none border-2 border-x-0 border-t-0 border-b-text-primary text-center font-bold`
                      : ` w-full cursor-pointer border-b-text-primary text-center`
                  }
                >
                  <span
                    className={
                      openTab === 1 ? `my-4 font-bold` : `py-1 font-normal`
                    }
                  >
                    Additional Info
                  </span>
                </div>
                <div
                  onClick={() => {
                    setOpenTab(2);
                  }}
                  className={
                    openTab === 2
                      ? `w-full cursor-pointer select-none border-2 border-x-0 border-t-0 border-b-text-primary text-center  font-bold`
                      : ` w-full cursor-pointer border-b-text-primary text-center`
                  }
                >
                  <span className={openTab === 2 ? `font-bold` : `font-normal`}>
                    Reviews
                  </span>
                </div>
              </div>
              {openTab === 1 && (
                <div className="p-8">
                  <h3 className="sr-only">Additional Info</h3>
                  <Markdown
                    content={product?.itemData?.description as string}
                  />
                </div>
              )}
              {openTab === 2 && (
                <div className="p-2">
                  <h3 className="sr-only">License</h3>

                  <div className="max-w-none text-text-primary">
                    <div className="mx-auto w-full py-2 px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:py-2 lg:px-8">
                      <div className="lg:col-span-4">
                        <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">
                          Customer Reviews
                        </h2>

                        <div className="mt-3 flex items-center">
                          <div>
                            <div className="flex items-center">
                              <Stars rating={averageRating} />
                            </div>
                            <p className="sr-only">
                              {averageRating} out of 5 stars
                            </p>
                          </div>
                          <p className="ml-2 text-sm text-text-primary">
                            Based on {reviews?.length} reviews
                          </p>
                        </div>

                        <div className="mt-6">
                          <h3 className="sr-only">Review data</h3>

                          <dl className="space-y-2">
                            {reviews
                              ?.sort(
                                (a, b) =>
                                  parseFloat(b.rating.toString()) -
                                  parseFloat(a.rating.toString())
                              )
                              .map((review) => (
                                <div
                                  key={review.id}
                                  className="flex items-center text-sm"
                                >
                                  <dt className="flex flex-1 items-center">
                                    <span className="w-3 pr-5 pt-0.5 font-medium text-text-primary">
                                      {parseFloat(review.rating.toString())}
                                    </span>
                                    <span className="sr-only">
                                      star reviews
                                    </span>
                                    <div
                                      aria-hidden="true"
                                      className="ml-1 flex flex-1 items-center"
                                    >
                                      <Stars review={review} />
                                      <div className="relative ml-3 flex-1">
                                        <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                        {parseFloat(review.rating.toString()) >
                                        0 ? (
                                          <div
                                            className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                            style={{
                                              width: `calc(${review.rating} / ${reviews.length} * 100% / 5)`,
                                            }}
                                          />
                                        ) : null}
                                      </div>
                                    </div>
                                  </dt>
                                  <dd className="ml-3 w-10 text-right text-sm tabular-nums text-text-primary">
                                    {Math.round(
                                      ((parseInt(
                                        reviews
                                          .filter(
                                            (review) =>
                                              review.rating === review.rating
                                          )
                                          .length.toString()
                                      ) /
                                        reviews.length) *
                                        100) /
                                        reviews.length
                                    )}
                                    %
                                  </dd>
                                </div>
                              ))}
                          </dl>
                        </div>

                        <div className="mt-10 rounded-md border border-text-secondary p-3">
                          <h3 className="text-lg font-medium text-text-primary">
                            Share your thoughts
                          </h3>
                          <p className="mt-1 text-sm text-text-primary">
                            If you’ve used this product, share your thoughts
                            with other customers
                          </p>
                          {!session?.user ? (
                            <div className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-text-primary hover:bg-gray-50 sm:w-auto lg:w-full">
                              <Link href={`/login?returnTo=${currentPath}`}>
                                <a>Login to write a review</a>
                              </Link>
                            </div>
                          ) : (
                            <div className="flex w-full flex-col items-stretch justify-start space-y-3 p-2">
                              <div className="flex space-x-2 text-sm">
                                <span>Reviewed by:</span>
                                <span>{session.user.firstName}</span>
                              </div>
                              <div className="">
                                <NewReview
                                  rating={rating}
                                  setRating={setRating}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="comment"
                                  className="block w-full text-sm font-medium text-text-primary"
                                ></label>
                                <div className="mt-1">
                                  <textarea
                                    ref={reviewInputRef}
                                    rows={4}
                                    name="comment"
                                    id="comment"
                                    className="block w-full rounded-md border border-text-secondary p-2 focus:border-text-primary focus:ring-text-primary sm:text-sm"
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                              <div className="flex w-full items-center justify-end">
                                <button
                                  onClick={handleNewReview}
                                  type="button"
                                  className="inline-flex w-fit items-center rounded-md border border-text-secondary bg-button px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:border-black"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-8 sm:pt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
                        <h3 className="sr-only">Recent reviews</h3>

                        <div className="flow-root">
                          <div className="-my-12 divide-y divide-gray-200">
                            {reviews?.map((review) => {
                              const reviewer = reviewers?.find(
                                (reviewer) => reviewer.id === review.userId
                              );
                              return (
                                <div key={review.id} className="py-12">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="text-sm font-bold text-text-primary">
                                          {reviewer?.firstName}
                                        </h4>
                                        <h5 className="text-xs">
                                          {moment(
                                            review.createdAt?.toString()
                                          ).fromNow()}
                                        </h5>
                                      </div>
                                      <div className="mt-1 flex items-center">
                                        <Stars review={review} />
                                      </div>
                                      <p className="sr-only">
                                        {parseFloat(review.rating.toString())}
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className="mt-4 space-y-6 text-base italic text-text-primary"
                                    dangerouslySetInnerHTML={{
                                      __html: review.comment,
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getStaticPaths = async (context: GetStaticPathsContext) => {
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
      params: {
        id: product.itemData?.name?.replace(/ /g, "-").toLowerCase(),
        category: categoryQuery
          ?.find((category) => category.id === product.itemData?.categoryId)
          ?.categoryData?.name?.replace(/ /g, "-")
          .toLowerCase(),
      },
    }));
  return {
    paths: paths || null,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });

  const productsQuery = await ssg.fetchQuery(
    "square-products.search-product-by-fullname",
    {
      productName: context?.params?.id as string,
    }
  );

  return {
    props: {
      trpcState: ssg.dehydrate(),
      productQuery: JSON.parse(JSON.stringify(productsQuery)),
    },
    revalidate: 900,
  };
};

export default Product;
