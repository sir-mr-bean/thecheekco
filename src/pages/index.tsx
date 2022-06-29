import { RoughNotation } from "react-rough-notation";
import { CartState } from "../../context/Cart/Context";
import { Dispatch, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import {
  BsStarFill,
  BsStarHalf,
  BsStar,
  BsHeartFill,
  BsEmojiHeartEyesFill,
  BsFillCalendarCheckFill,
} from "react-icons/bs";
import { FaKissWinkHeart, FaShippingFast } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import toast from "react-hot-toast";
import superjson from "superjson";
import { useInViewport } from "react-in-viewport";
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

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const notationRef = useRef(null);
  const { inViewport } = useInViewport(notationRef);
  const { data: categoriesData } = trpc.useQuery(["all-categories"], {
    context: {
      skipBatch: true,
    },
  });
  const { data: productsData } = trpc.useQuery(["all-products"]);
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

  const allNaturalProducts = productsData?.filter(
    (p) =>
      p.itemData?.variations?.[0]?.customAttributeValues?.[
        "Square:a1089928-7880-407e-93f3-08dfe506ac14"
      ]?.booleanValue === true
  );

  //create a typesafe function to return an icon from the react-icons library based on the icon name
  const Icon = (iconName: string) => {
    switch (iconName) {
      case "FaKissWinkHeart":
        return <FaKissWinkHeart size={25} />;
      case "FaShippingFast":
        return <FaShippingFast size={25} />;
      case "HiCursorClick":
        return <HiCursorClick size={25} />;
      case "BsStar":
        return <BsStar size={25} />;
      case "BsStarHalf":
        return <BsStarHalf size={25} />;
      case "BsStarFill":
        return <BsStarFill size={25} />;
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

  // create a function to replace all spaces in a string with "-"
  const slugify = (string: string) => {
    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
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

  const collections = [
    {
      name: "Handcrafted Collection",
      href: "#",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg",
      imageAlt:
        "Brown leather key ring with brass metal loops and rivets on wood table.",
      description:
        "Keep your phone, keys, and wallet together, so you can lose everything at once.",
    },
    {
      name: "Organized Desk Collection",
      href: "#",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg",
      imageAlt:
        "Natural leather mouse pad on white desk next to porcelain mug and keyboard.",
      description:
        "The rest of the house will still be a mess, but your desk will look great.",
    },
    {
      name: "Focus Collection",
      href: "#",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg",
      imageAlt:
        "Person placing task list card into walnut card holder next to felt carrying case on leather desk pad.",
      description:
        "Be more productive than enterprise project managers with a single piece of paper.",
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

        <div className="relative z-0 pt-4 font-gothic font-normal text-white sm:mx-32 lg:mx-72">
          <div className="flex flex-col mx-4 h-fit space-y-2 sm:space-y-6">
            <div className="flex items-start justify-center w-full space-x-2 sm:space-x-6">
              <div className="flex flex-col items-center justify-start w-full space-y-2 sm:space-y-6 flex-1">
                <div className="bg-button rounded-lg flex flex-col items-center justify-center p-2 sm:py-6 lg:py-1.5 w-full shadow-slate-500 shadow-sm">
                  <div className="flex flex-row items-center justify-center h-14 sm:h-16 py-1">
                    <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl text-center h-fit">
                      More
                    </span>
                    <div className="block w-20 sm:w-24  lg:w-32">
                      <Image
                        src={bumlogo}
                        width={75}
                        height={75}
                        layout="responsive"
                      />
                    </div>
                    <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl text-left h-fit whitespace-nowrap">
                      than
                    </span>
                  </div>
                  <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl h-fit text-center lg:px-48">
                    your bathroom can handle!
                  </span>
                  <span className="text-base lg:text-2xl text-center font-thin pt-1 sm:pt-6 px-0 sm:px-16 lg:px-48 xl:px-56">
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
                  />
                </div>
                <div className="w-full flex items-center justify-center h-full">
                  <div className="w-full border border-text-primary rounded-lg h-28 sm:h-32 lg:h-64 mr-2 sm:mr-6 relative">
                    <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                      <div className="py-1 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 px-2 sm:px-4">
                            <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-text-primary">
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
                    />
                  </div>
                  <div className="w-full border border-text-primary rounded-lg h-28 sm:h-32 lg:h-64 relative">
                    <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                      <div className="py-1 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 px-2 sm:px-4">
                            <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-text-primary">
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
                    />
                  </div>
                </div>
              </div>
              <div className="w-1/3 lg:w-2/5 space-y-2 sm:space-y-6 box-content">
                <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg h-64 sm:h-80 lg:h-[450px] relative box-content">
                  <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                    <div className="py-1 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 px-2 sm:px-4">
                          <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-text-primary">
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
                  />
                </div>
                <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg h-64 sm:h-80 lg:h-[400px] relative box-content">
                  <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                    <div className="py-1 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 px-2 sm:px-4">
                          <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-text-primary">
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
                  />
                </div>
              </div>
            </div>
            <div className="w-full border-text-primary border rounded-lg h-36 sm:h-48 lg:h-72 relative">
              <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                <div className="py-1 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 px-2 sm:px-4">
                      <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-text-primary">
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
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-text-primary px-6 space-y-3">
          <div>
            <div className="flex justify-evenly items-center max-w-3xl mx-auto">
              <div className="relative w-full h-full">
                <Image
                  src={"/images/ECO1.png"}
                  width={450}
                  height={415}
                  layout="responsive"
                  objectFit="contain"
                  className="mx-auto"
                />
              </div>
              <div className="relative w-full">
                <Image
                  src={"/images/ECO2.png"}
                  width={450}
                  height={415}
                  layout="responsive"
                  className="mx-auto "
                />
              </div>
              <div className="relative w-full h-full">
                <Image
                  src={"/images/ECO3.png"}
                  width={450}
                  height={415}
                  layout="responsive"
                  className="mx-auto"
                />
              </div>
              <div className="relative w-full h-full">
                <Image
                  src={"/images/ECO4.png"}
                  width={450}
                  height={415}
                  layout="responsive"
                  className="mx-auto"
                />
              </div>
              <div className="relative w-full h-full">
                <Image
                  src={"/images/ECO5.png"}
                  width={450}
                  height={415}
                  layout="responsive"
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <main>
          {/* Category section */}
          <section
            aria-labelledby="category-heading"
            className="bg-paper-bg bg-cover flex flex-col justify-center items-center w-full flex-1"
          >
            <div className="bg-white bg-opacity-30 bg-cover relative w-full h-full ">
              <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0 w-full pt-6 sm:my-7">
                <h2
                  id="category-heading"
                  className="text-xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                >
                  Shop by Category
                </h2>
                <a
                  href="/shop"
                  className="hidden text-sm sm:text-lg font-semibold text-text-primary hover:text-text-secondary sm:block"
                >
                  Browse all categories<span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
              <div className="flex flex-wrap px-4 sm:mx-auto items-center justify-center w-full">
                {categoriesData &&
                  productsData &&
                  categoriesData
                    .filter(
                      (item: CatalogObject) =>
                        item.itemData?.name?.charAt(0) != "_"
                    )
                    .map((category) => {
                      const randomProduct = productsData.find((product) => {
                        return product.itemData?.categoryId === category.id;
                      });
                      const productImage = productsData?.find(
                        (p) =>
                          p.type === "IMAGE" &&
                          randomProduct?.itemData?.imageIds?.includes(p.id)
                      );
                      return (
                        <Link
                          key={category?.categoryData?.name}
                          href={`/shop/${category.itemData?.name}`}
                          as={`/shop/${slugify(
                            category?.categoryData?.name as string
                          )}`}
                          className="relative overflow-hidden"
                        >
                          <div className="flex flex-wrap justify-center items-center m-4 md:m-8  cursor-pointer">
                            <div className="relative h-32 w-32 sm:h-64 sm:w-64">
                              <Image
                                priority={true}
                                src={
                                  productImage?.imageData?.url ||
                                  "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                }
                                width={100}
                                height={100}
                                objectFit="cover"
                                layout="responsive"
                                className="rounded-md"
                              />

                              <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                                <div className="py-1 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1 px-2 sm:px-4">
                                      <h3 className="text-sm sm:text-lg font-medium text-text-primary">
                                        {category?.categoryData?.name}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
              </div>

              <div className="px-4 sm:hidden">
                <a
                  href="/shop"
                  className="flex w-full items-center justify-end my-2 text-sm font-semibold text-text-primary hover:text-text-secondary"
                >
                  Browse all categories<span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col w-full sm:p-6 items-center justify-center pt-32">
              <div className="flex items-center justify-center pt-8">
                <span className="text-2xl sm:text-6xl text-text-primary font-gothic text-center">
                  Check out our fav
                </span>
              </div>
              <div
                ref={notationRef}
                className="flex items-center justify-center w-full text-3xl sm:text-6xl lg:text-7xl text-text-primary font-gothic text-center py-3 space-x-2 sm:space-x-3"
              >
                <span className="w-fit mr-3">all</span>
                <RoughNotation
                  type="circle"
                  color="#E3BB9D"
                  show={inViewport}
                  animate
                  animationDelay={500}
                  animationDuration={1000}
                  strokeWidth={4}
                  padding={[12, 8]}
                >
                  <span className="">natural</span>
                </RoughNotation>
                <span>picks.</span>
              </div>
              <div className="flex flex-wrap w-full h-fit items-center justify-center sm:justify-evenly pt-10">
                {allNaturalProducts?.slice(0, 6).map((product) => {
                  const productImage = productsData?.find(
                    (p) =>
                      p.type === "IMAGE" &&
                      product?.itemData?.imageIds?.includes(p.id)
                  );
                  const productCategory = categoriesData?.find(
                    (category) => category.id === product?.itemData?.categoryId
                  );
                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${productCategory?.categoryData?.name}/${product.itemData?.name}`}
                      as={`/shop/${
                        productCategory?.categoryData?.name
                      }/${slugify(product.itemData?.name as string)}`}
                      className="relative overflow-hidden"
                    >
                      <div className="flex flex-col justify-center items-center h-32 w-32 m-4 md:m-4 cursor-pointer hover:scale-105">
                        <div className="relative h-full w-full">
                          <Image
                            priority={true}
                            src={
                              productImage?.imageData?.url ||
                              "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                            }
                            width={150}
                            height={150}
                            objectFit="cover"
                            layout="responsive"
                            className="rounded-md"
                          />
                        </div>
                        <span className="text-xs font-bold whitespace-nowrap text-text-primary w-full text-left py-2">
                          {product?.itemData?.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured section */}
          <section
            aria-labelledby="social-impact-heading"
            className="mt-16 sm:mt-24 bg-paper-bg bg-cover bg-center"
          >
            <div className="relative overflow-hidden">
              <div className="relative bg-white bg-opacity-30 py-16 sm:py-20 ">
                <div className="relative sm:space-x-5 flex flex-col sm:flex-row items-center justify-between sm:justify-center text-center sm:mx-10">
                  <h2
                    id="social-impact-heading"
                    className="font-extrabold tracking-tight text-text-secondary max-w-xl font-gothic text-center sm:text-left mx-1"
                  >
                    <span className="text-4xl lg:text-6xl font-semibold">
                      The Cheeky{" "}
                    </span>
                    <span className="text-4xl lg:text-6xl font-semibold">
                      Gua Sha
                    </span>
                    <div className="mt-3 font-light text-xl text-text-primary space-y-3 sm:pr-16 text-center sm:text-left">
                      <p>
                        A traditional rose quartz stone tool, used to relieve
                        muscle tension, aid lymphatic drainage, increase
                        elasticity, blood circulation.{" "}
                      </p>
                      <p>
                        Firmly guide the stone along the skin in upward motions,
                        slowly increasing pressure.
                      </p>
                    </div>
                  </h2>
                  <div className="relative w-fit flex flex-col text-text-primary text-xl">
                    <Image
                      src="https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/istockphoto_1320900406_612x612_removebg_preview_19c4bb41fa.png"
                      height={612}
                      width={612}
                      layout="responsive"
                    />
                    <div className="flex flex-col space-y-2 pb-3 my-2 items-center justify-center text-lg">
                      <div className="flex items-center space-x-2">
                        <BsHeartFill className="w-6 h-6" />
                        <span>lifts and firms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BsEmojiHeartEyesFill className="w-6 h-6" />
                        <span>helping to aid allergy relief</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 lg:whitespace-nowrap">
                        <FaKissWinkHeart className="w-6 h-6" />
                        <span>reduces puffiness & inflimation</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-fit">
                    {productsData &&
                      productsData
                        .filter((item) => item.itemData?.name === "The Gua Sha")
                        .map((product) => {
                          const productImage = productsData?.find(
                            (p) =>
                              p.type === "IMAGE" &&
                              product?.itemData?.imageIds?.includes(p.id)
                          );
                          const productCategory = categoriesData?.find(
                            (category) =>
                              category.id === product?.itemData?.categoryId
                          );

                          return (
                            <div key={product.id}>
                              <div className="relative">
                                <Link
                                  href="/shop/[category]/[id]"
                                  as={`/shop/${
                                    productCategory?.categoryData?.name
                                  }/${slugify(
                                    product.itemData?.name as string
                                  )}`}
                                >
                                  <div className="relative  mx-4 w-60 h-60 rounded-lg overflow-hidden cursor-pointer border-2 border-[#DBA37D]">
                                    {productImage?.imageData?.url && (
                                      <Image
                                        layout="fill"
                                        src={productImage?.imageData?.url}
                                        alt={product.itemData?.name}
                                        className="object-center object-cover"
                                      />
                                    )}
                                  </div>
                                </Link>
                                <div className="relative mt-4 space-y-2">
                                  <Link
                                    href="/shop/[category]/[id]"
                                    as={`/shop/${
                                      productCategory?.categoryData?.name
                                    }/${slugify(
                                      product.itemData?.name as string
                                    )}`}
                                  >
                                    <h3 className="text-sm font-medium text-text-primary">
                                      {product?.itemData?.name}
                                    </h3>
                                  </Link>
                                  <div className="flex text-header-brown justify-center">
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStar />
                                    <BsStar />
                                  </div>
                                  <p className="relative text-lg font-bold text-text-primary">
                                    $
                                    {(
                                      Number(
                                        product.itemData?.variations?.[0]
                                          ?.itemVariationData?.priceMoney
                                          ?.amount
                                      ) / 100
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-6">
                                <button
                                  onClick={() => handleAdd(product)}
                                  className="relative flex w-fit mx-auto bg-button rounded-2xl py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
                                >
                                  Add to cart
                                  <span className="sr-only">
                                    {product.itemData?.name}
                                  </span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Collection section */}
          <section
            aria-labelledby="collection-heading"
            className="w-full relative"
          >
            <div className="flex font-gothic text-text-primary">
              <div className="flex flex-col w-1/2 items-center justify-center">
                {/* Title + Desc */}
                <span className="text-6xl font-semibold font-gothic">
                  Meet The Minis
                </span>
                <span className="text-xl px-20">
                  Unsure on a formulation or just wanting to grab some handbag
                  goodies, these Mini’s are for you! Travel, gift, just don’t
                  get caught without these essentials.
                </span>
                <div className="flex space-x-2">
                  <div className="bg-button rounded-full p-10 w-10 h-10"></div>
                  <div className="bg-button rounded-full p-10 w-10 h-10"></div>
                </div>
                <div></div>
              </div>
              <div className="flex flex-wrap">{/* Products */}</div>
            </div>
          </section>

          {/* Featured section */}
          <section
            aria-labelledby="comfort-heading"
            className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8"
          >
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  layout="fill"
                  src="https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-02.jpg"
                  alt=""
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
                <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
                  <h2
                    id="comfort-heading"
                    className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl"
                  >
                    Simple productivity
                  </h2>
                  <p className="mt-3 text-xl text-text-primary">
                    Endless tasks, limited hours, a single piece of paper. Not
                    really a haiku, but we're doing our best here. No kanban
                    boards, burndown charts, or tangled flowcharts with our
                    Focus system. Just the undeniable urge to fill empty
                    circles.
                  </p>
                  <a
                    href="#"
                    className="mt-8 w-full block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-text-secondary hover:bg-gray-100 sm:w-auto"
                  >
                    Shop Focus
                  </a>
                </div>
              </div>
            </div>
          </section>
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
  await ssg.fetchQuery("all-products");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 900,
  };
};
