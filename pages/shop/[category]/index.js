import { React } from "react";
import { getStrapiURL } from "../../../utils/api";
import Image from "next/image";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { CartState } from "../../../context/Context";
import { addToCart } from "../../../context/Reducer";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";

const CategoryPage = ({ data, onAdd }) => {
  const router = useRouter();
  const query = router.query;
  const { cart, dispatch } = CartState();
  const products = data.data?.[0].attributes.products;

  const handleAdd = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      item: product,
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
                src={product.attributes?.itemimage?.data?.attributes?.url}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1 my-auto">
              <p className="mt-1 text-sm text-text-primary font-gothic">
                {product.attributes.name} added to cart.
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
          <h2 className="text-4xl text-text-primary font-gothic font-extralight">
            {data.data?.[0].attributes.displayname}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-3 lg:grid-cols-4 xl:gap-x-10 ">
            {products &&
              products.data.map((product) => (
                <div key={product.id}>
                  <div className="relative">
                    <Link
                      href="/shop/[category]/[id]"
                      as={`/shop/${query.category}/${product.attributes.name
                        .replace(/ /g, "-")
                        .toLowerCase()}`}
                    >
                      <div className="relative w-full h-72 rounded-lg overflow-hidden cursor-pointer border-2 border-[#DBA37D]">
                        <Image
                          layout="fill"
                          src={
                            product.attributes?.itemimage?.data?.attributes?.url
                          }
                          alt={product.attributes.imagealttext}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                    </Link>
                    <div className="relative mt-4 space-y-2">
                      <Link
                        href="/shop/[category]/[id]"
                        as={`/shop/${query.category}/${product.attributes.name
                          .replace(/ /g, "-")
                          .toLowerCase()}`}
                      >
                        <h3 className="text-sm font-medium text-gray-900">
                          {product.attributes.name}
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
                        {product.attributes.price
                          .toFixed(2)
                          .toLocaleString("en-us")}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.color}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleAdd(product)}
                      className="relative flex bg-button rounded-2xl py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
                    >
                      Add to cart
                      <span className="sr-only">{product.attributes.name}</span>
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

export const getStaticPaths = async () => {
  const categories = getStrapiURL(`/api/categories`);
  const res = await fetch(categories, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to fetch posts, received status ${res.status}`);
  }

  return {
    paths: data.data.map((item) => ({
      params: {
        category: item.attributes.name.toString(),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const productsURL = getStrapiURL(
    `/api/categories?filters[name][$eq]=${params.category}&populate[0]=products&populate[1]=products.itemimage&populate[2]=products.categories`
  );
  const res = await fetch(productsURL, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch posts, received status ${res.status}`);
  }
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
};