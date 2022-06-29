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

const tabs = [
  {
    index: 1,
    name: "additionalinfo",
  },
  {
    index: 2,
    name: "faq",
  },
  {
    index: 3,
    name: "license",
  },
];

const faqs = [
  {
    question: "What format are these icons?",
    answer:
      "The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.",
  },
  {
    question: "Can I use the icons at different sizes?",
    answer:
      "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
  },
  // More FAQs...
];

const Markdown = (content) => {
  var converter = new showdown.Converter();
  var html = converter.makeHtml(content.content);
  return (
    <div className="bg-transparent text-text-primary font-gothic prose prose-stone py-1">
      {ReactHtmlParser(html)}
    </div>
  );
};

type CartObject = CatalogObject & {
  quantity?: number;
  productImage?: string;
};

const Product = () => {
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
  const tabFromQuery = tabs.find((tab) => tab.name === router.query?.tab);
  const currentPath = router.asPath;
  const [openTab, setOpenTab] = useState(tabFromQuery?.index || 1);
  const [averageRating, setAverageRating] = useState(0);
  const { data: productQuery } = trpc.useQuery([
    "square-products.search-product",
    { productName: router.query?.id as string },
  ]);
  const product = productQuery?.find((product) => product.type === "ITEM");
  const image = productQuery?.find((product) => product.type === "IMAGE");
  const utils = trpc.useContext();
  const reviewMutation = trpc.useMutation(["review.create-review"], {
    onSuccess(input) {
      utils.invalidateQueries(["review.fetch-reviews"]);
    },
  });
  const { data: reviews, status: reviewQueryStatus } = trpc.useQuery([
    "review.fetch-reviews",
    {
      productIds: [product?.id as string],
    },
  ]);
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
      reviewMutation.mutate({
        productId: product?.id as string,
        userId: session.user.id,
        rating: rating,
        comment: reviewInputRef.current?.value as string,
      });

      toast.success("Review submitted for approval!");
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
                  {quantity?.current?.value} {product.itemData?.name} added to
                  cart.
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
    <>
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
          <div className="mx-auto pt-10 pb-16 px-4 sm:pb-12 sm:px-6 lg:max-w-5xl lg:px-8 space-y-6 ">
            {/* Product */}
            <div className="flex flex-col sm:flex-row  justify-items-stretch items-stretch sm:space-x-6">
              {/* Product image */}

              <div className="overflow-hidden relative w-3/4 mx-auto sm:w-2/3 mb-6 sm:mb-0">
                <Image
                  priority
                  layout="responsive"
                  objectFit="cover"
                  height={1920}
                  width={1080}
                  src={
                    image?.imageData?.url ||
                    "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                  }
                  alt={product?.itemData?.name}
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Product details */}
              <div className="max-w-xl sm:max-w-none border rounded-lg bg-white sm:px-10 flex flex-col justify-around w-full px-4">
                <div className="flex flex-col space-y-2 items-center justify-center">
                  <div className="flex space-x-2 items-center">
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl px-3 pt-4">
                      {product?.itemData?.name}
                    </h1>
                    <FavouriteButton
                      product={product}
                      image={image?.imageData?.url}
                      styles={{
                        position: "absolute",
                        top: "-50px",
                        right: "-150px",
                      }}
                    />
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

                <p className="text-text-primary mt-6 p-3"></p>
                <div className="flex justify-between items-center space-x-10">
                  <button
                    onClick={() => handleAdd(product)}
                    type="button"
                    className="mt-3 uppercase bg-button border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-text-primary"
                  >
                    Add to cart
                  </button>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <select
                      ref={quantity}
                      id="quantity"
                      name="quantity"
                      className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm rounded-md border text-text-primary"
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

                <div className="border-t border-gray-200 mt-5 pt-5 flex justify-evenly items-center w-full">
                  <span className="text-text-primary text-2xl">
                    $
                    {(
                      Number(
                        product?.itemData?.variations?.[0]?.itemVariationData
                          ?.priceMoney?.amount
                      ) / 100
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 mt-5 py-1 w-full flex justify-center items-center">
                  <ul role="list" className="flex items-center space-x-6">
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-[#4267B2]"
                      >
                        <span className="sr-only">Share on Facebook</span>
                        <svg
                          className="w-5 h-5"
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
                        href="#"
                        className="flex items-center justify-center w-6 h-6 text-gray-400"
                      >
                        <span className="sr-only">Share on Instagram</span>
                        <svg className="w-6 h-6">
                          <radialGradient id="rg" r="150%" cx="30%" cy="107%">
                            <stop stopColor="#fdf497" offset="0" />
                            <stop stopColor="#fdf497" offset="0.05" />
                            <stop stopColor="#fd5949" offset="0.45" />
                            <stop stopColor="#d6249f" offset="0.6" />
                            <stop stopColor="#285AEB" offset="0.9" />
                          </radialGradient>
                        </svg>
                        <div id="ig">
                          <svg
                            className="w-6 h-6 igsvg"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            id="ig"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-[#1DA1F2]"
                      >
                        <span className="sr-only">Share on Twitter</span>
                        <svg
                          className="w-5 h-5"
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
            <div className="flex flex-col w-full justify-center items-start bg-white rounded-lg ">
              <div className="lg:mt-0 lg:col-span-4  flex flex-row justify-center items-center pb-5 px-4 w-full py-4">
                <div
                  onClick={() => {
                    setOpenTab(1);
                  }}
                  className={
                    openTab === 1
                      ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none text-center`
                      : ` border-b-text-primary cursor-pointer w-full text-center`
                  }
                >
                  <span
                    className={
                      openTab === 1 ? `font-bold my-4` : `font-normal py-1`
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
                      ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none  text-center`
                      : ` border-b-text-primary cursor-pointer w-full text-center`
                  }
                >
                  <span className={openTab === 2 ? `font-bold` : `font-normal`}>
                    FAQ
                  </span>
                </div>
                <div
                  onClick={() => {
                    setOpenTab(3);
                  }}
                  className={
                    openTab === 3
                      ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none  text-center`
                      : ` border-b-text-primary cursor-pointer w-full text-center`
                  }
                >
                  <span className={openTab === 3 ? `font-bold` : `font-normal`}>
                    Reviews
                  </span>
                </div>
              </div>
              {openTab === 1 && (
                <div className="p-2">
                  <h3 className="sr-only">Additional Info</h3>
                  <Markdown content={product?.itemData?.description} />
                </div>
              )}
              {openTab === 2 && (
                <div className="text-sm text-gray-500 p-2">
                  <h3 className="sr-only">Frequently Asked Questions</h3>

                  <dl>
                    {faqs.map((faq) => (
                      <Fragment key={faq.question}>
                        <dt className="mt-5 font-medium text-text-primary">
                          {faq.question}
                        </dt>
                        <dd className="mt-2 prose prose-sm max-w-none text-gray-500">
                          <p>{faq.answer}</p>
                        </dd>
                      </Fragment>
                    ))}
                  </dl>
                </div>
              )}
              {openTab === 3 && (
                <div className="p-2">
                  <h3 className="sr-only">License</h3>

                  <div className="max-w-none text-text-primary">
                    <div className="w-full mx-auto py-2 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:py-2 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
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
                                  <dt className="flex-1 flex items-center">
                                    <span className="w-3 font-medium text-text-primary pr-5 pt-0.5">
                                      {parseFloat(review.rating.toString())}
                                    </span>
                                    <span className="sr-only">
                                      star reviews
                                    </span>
                                    <div
                                      aria-hidden="true"
                                      className="ml-1 flex-1 flex items-center"
                                    >
                                      <Stars review={review} />
                                      <div className="ml-3 relative flex-1">
                                        <div className="h-3 bg-gray-100 border border-gray-200 rounded-full" />
                                        {parseFloat(review.rating.toString()) >
                                        0 ? (
                                          <div
                                            className="absolute inset-y-0 bg-yellow-400 border border-yellow-400 rounded-full"
                                            style={{
                                              width: `calc(${review.rating} / ${reviews.length} * 100% / 5)`,
                                            }}
                                          />
                                        ) : null}
                                      </div>
                                    </div>
                                  </dt>
                                  <dd className="ml-3 w-10 text-right tabular-nums text-sm text-text-primary">
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

                        <div className="mt-10 border border-text-secondary rounded-md p-3">
                          <h3 className="text-lg font-medium text-text-primary">
                            Share your thoughts
                          </h3>
                          <p className="mt-1 text-sm text-text-primary">
                            If you’ve used this product, share your thoughts
                            with other customers
                          </p>
                          {!session?.user ? (
                            <div className="mt-6 inline-flex w-full bg-white border border-gray-300 rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-text-primary hover:bg-gray-50 sm:w-auto lg:w-full">
                              <Link href={`/login?returnTo=${currentPath}`}>
                                <a>Login to write a review</a>
                              </Link>
                            </div>
                          ) : (
                            <div className="flex flex-col items-stretch justify-start w-full space-y-3 p-2">
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
                                  className="block text-sm font-medium text-text-primary w-full"
                                ></label>
                                <div className="mt-1">
                                  <textarea
                                    ref={reviewInputRef}
                                    rows={4}
                                    name="comment"
                                    id="comment"
                                    className="border focus:ring-text-primary focus:border-text-primary block w-full sm:text-sm border-text-secondary rounded-md p-2"
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                              <div className="flex w-full items-center justify-end">
                                <button
                                  onClick={handleNewReview}
                                  type="button"
                                  className="w-fit inline-flex items-center px-2.5 py-1.5 border border-text-secondary shadow-sm text-xs font-medium rounded-md bg-button hover:border-black text-white"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sm:pt-12 pt-8 lg:mt-0 lg:col-start-6 lg:col-span-7">
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
                                      <div className="flex space-x-2 items-center">
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
    </>
  );
};

export const getStaticPaths = async (context: GetStaticPathsContext) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });
  const productsQuery = await ssg.fetchQuery("square-products.all-products");
  return {
    paths: productsQuery
      .filter((i) => i.categoryData?.name)
      .map((item) => ({
        params: {
          id: item?.itemData?.name
            ?.toLowerCase()
            .replaceAll(" ", "-")
            .toString(),
          category:
            item?.categoryData?.name?.toLowerCase().replaceAll(" ", "-") ||
            null,
        },
      })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });

  return {
    props: ssg.dehydrate(),
    revalidate: 900,
  };
};

export default Product;
