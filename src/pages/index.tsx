import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import Carousel from "../../lib/react-elastic-carousel/dist";
import { ReactElasticCarouselProps } from "../../lib/react-elastic-carousel/dist";
import { CartState } from "../../context/Context";
import * as React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";
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
import * as icons from "react-icons";
import { FaIcons } from "react-icons/fa";
import { Product, Category } from "../../@types/Product";
import { trpc } from "@/utils/trpc";

export default function Home({
  productsData: productsData,
  categoriesData: categoriesData,
}: {
  productsData: [Product];
  categoriesData: [Category];
}) {
  const categories = trpc.useQuery(["categories"]);
  console.log(categories);

  const carouselRef: any = useRef();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const { cart, dispatch } = CartState();

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

      href: "#",
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

  const handleAdd = (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      item: product,
      qty: 1,
    });
    if (window !== undefined) {
    }
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
                src={
                  product.image ||
                  "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                }
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

        <div className="relative z-0 pt-4 sm:pt-16">
          <div className="relative flex justify-center items-center text-eco w-fit mx-auto pt-24 sm:pt-20">
            <div className="absolute -top-56 -left-64 sm:-top-[500px] sm:-left-[750px] lg:-top-[550px]  lg:-left-[750px] overflow-x-hidden opacity-80 z-0">
              <Image
                src="/images/ecojuneimage.svg"
                height={1037}
                width={1236}
                objectPosition="bottom"
                objectFit="contain"
                className="-rotate-[30deg] scale-[0.35] sm:scale-[0.45] lg:scale-[0.6] z-0"
              />
            </div>
            <div className="absolute -bottom-96 -right-[300px] sm:-bottom-[550px] sm:-right-[570px] lg:-bottom-[550px] lg:-right-[800px] opacity-80 ">
              <Image
                src="/images/ecoleaf.svg"
                height={1083}
                width={1093}
                objectPosition="bottom"
                objectFit="contain"
                className="-rotate-[90deg] scale-[0.20] sm:scale-[0.25] lg:scale-[0.45] z-0 overflow-x-hidden"
              />
            </div>
            <span className="text-5xl sm:text-6xl lg:text-9xl uppercase font-roboto z-20">
              The Cheek Co.
            </span>
            <div className="absolute top-10 right-0 sm:top-7 lg:-top-2 lg:-right-2 rotate-6 flex">
              <span className="text-4xl sm:text-5xl lg:text-8xl font-shadows">
                eco june at
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center space-x-4 py-8 px-4 lg:p-16">
          <div className="flex flex-col space-y-10 items-center justify-center w-full">
            <span className="text-text-primary text-sm sm:text-xl lg:text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              pariatur delectus enim quia, rem repudiandae minima sunt
              aspernatur non natus corrupti ipsa, dolorum voluptatum, ab
              molestias totam odio corporis alias!
            </span>
            <span className="text-text-primary text-sm sm:text-xl lg:text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              pariatur delectus enim quia, rem repudiandae minima sunt
              aspernatur non natus corrupti ipsa, dolorum voluptatum, ab
              molestias totam odio corporis alias!
            </span>
          </div>
          <div className="w-full relative sm:p-3 lg:px-32">
            <Image
              src={"/images/ADPost.png"}
              width={200}
              height={200}
              layout="responsive"
              className="absolute top-0 left-0 "
            />
          </div>
        </div>

        <main>
          {/* Category section */}
          <section
            aria-labelledby="category-heading"
            className="pt-6 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8"
          >
            <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
              <h2
                id="category-heading"
                className="text-xl font-extrabold tracking-tight text-text-secondary"
              >
                Shop by Category
              </h2>
              <a
                href="/shop"
                className="hidden text-sm font-semibold text-text-primary hover:text-text-secondary sm:block"
              >
                Browse all categories<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            <Carousel
              isRTL={false}
              ref={carouselRef}
              pagination={false}
              showArrows={false}
              itemsToShow={3}
              itemsToScroll={2}
              onChange={(currentItem: any) =>
                setActiveItemIndex(currentItem.index)
              }
            >
              {categoriesData &&
                productsData &&
                categoriesData

                  .filter(
                    (item: Category) => item.category_data.name.charAt(0) != "_"
                  )
                  .map((category: Category) => {
                    const randomProduct = productsData.find(
                      (product: Product) => {
                        return (
                          product.category?.category_data.name ===
                          category.category_data.name
                        );
                      }
                    );

                    return (
                      <Link
                        key={category.category_data.name}
                        href={`/shop/${category.category_data.name}`}
                        as={`/shop/${slugify(category?.category_data?.name)}`}
                        className="relative overflow-hidden"
                      >
                        <div className="flex justify-center items-center h-96 w-full m-1 sm:m-2 md:m-4 cursor-pointer">
                          <div className="relative h-full w-full ">
                            <Image
                              priority={true}
                              src={
                                randomProduct?.image ||
                                "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                              }
                              objectFit="cover"
                              layout="fill"
                              className="rounded-md"
                            />

                            <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                              <div className="sm:px-2 py-2 bg-white bg-opacity-80 border border-transparent rounded-md whitespace-nowrap shadow-sm">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 px-2 sm:px-4">
                                    <h3 className="text-sm sm:text-lg font-medium text-text-primary">
                                      {category.category_data.name}
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
            </Carousel>
            <div className="flex justify-center items-center space-x-3">
              {categoriesData &&
                productsData &&
                categoriesData
                  .filter(
                    (item: Category) => item.category_data.name.charAt(0) != "_"
                  )
                  .filter((item: Category, i: number) => i % 2 === 0)
                  .map((category: Category, i: number) => {
                    const randomProduct = productsData?.find(
                      (product: Product) =>
                        product.category?.category_data?.name ===
                        category.category_data.name
                    );
                    return (
                      <button
                        className={
                          activeItemIndex === (i === 0 ? i : i + 1)
                            ? `inline-block bg-button border border-transparent rounded-full p-1.5 text-xs sm:text-base font-medium border-text-primary text-text-secondary hover:border-black`
                            : `inline-block bg-button border border-transparent rounded-full p-1.5 text-xs sm:text-base font-medium text-text-secondary hover:border-black`
                        }
                        key={i}
                        data-active={
                          i >= activeItemIndex && i < activeItemIndex
                            ? true
                            : undefined
                        }
                        onClick={() =>
                          carouselRef.current.goTo(i > 0 ? i + 1 : i)
                        }
                      />
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
                        .filter((item: Product) => item.name === "The Gua Sha")
                        .map((product: Product) => {
                          return (
                            <div key={product.id}>
                              <div className="relative">
                                <Link
                                  href="/shop/[category]/[id]"
                                  as={`/shop/${
                                    product.category?.category_data?.name
                                  }/${product.name
                                    .replace(/ /g, "-")
                                    .toLowerCase()}`}
                                >
                                  <div className="relative  mx-4 w-60 h-60 rounded-lg overflow-hidden cursor-pointer border-2 border-[#DBA37D]">
                                    {product.image && (
                                      <Image
                                        layout="fill"
                                        src={product?.image}
                                        alt={product.name}
                                        className="object-center object-cover"
                                      />
                                    )}
                                  </div>
                                </Link>
                                <div className="relative mt-4 space-y-2">
                                  <Link
                                    href="/shop/[category]/[id]"
                                    as={`/shop/${
                                      product.category?.category_data?.name
                                    }/${product.name
                                      .replace(/ /g, "-")
                                      .toLowerCase()}`}
                                  >
                                    <h3 className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </h3>
                                  </Link>
                                  <div className="flex text-header-brown justify-center">
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStar />
                                    <BsStar />
                                  </div>
                                  <p className="relative text-lg font-bold text-black">
                                    $
                                    {(
                                      product.variations?.[0]
                                        ?.item_variation_data?.price_money
                                        ?.amount / 100
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
                                    {product.name}
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
                <img
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

export const getStaticProps: GetStaticProps = async () => {
  const categoriesURL = `https://thecheekco.vercel.app/api/fetchcategories`;
  const categoriesResult = await fetch(categoriesURL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "*",
    },
  });
  const categoriesData: [Category] = await categoriesResult.json();

  const productsURL = `https://thecheekco.vercel.app/api/fetchproducts`;
  const productsResult = await fetch(productsURL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "*",
    },
  });
  const productsDataResult: [Product] = await productsResult.json();
  const productsData = productsDataResult[0];

  if (!productsResult.ok || !categoriesResult.ok) {
    throw new Error(
      `Failed to fetch posts, received status ${productsResult.status}, ${categoriesResult.status}`
    );
  }

  return {
    props: {
      productsData,
      categoriesData,
    },
  };
};
