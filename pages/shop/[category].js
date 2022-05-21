import { React } from "react";
import axios from "axios";
import { getStrapiURL } from "../../utils/api";
import Image from "next/image";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const CategoryPage = ({ results }) => {
  //console.log(results.attributes.products);
  const products = results.attributes.products;
  console.log(products);

  return (
    <div>
      <div className="mx-6 md:mx-10 lg:mx-16">
        <div className="max-w-2xl py-4 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8 bg-bg-lighttan mt-24 shadow-[0_0px_7px_1px_rgba(0,0,0,0.51)]">
          <h2 className="text-4xl text-text-primary font-gothic font-bold">
            {results.attributes.displayname}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-3 lg:grid-cols-4 xl:gap-x-10 ">
            {products.data.map((product) => (
              <div key={product.id}>
                <div className="relative">
                  <div className="relative w-full h-72 rounded-lg overflow-hidden">
                    <Image
                      layout="fill"
                      src={product.attributes?.itemimage?.data?.attributes?.url}
                      alt={product.attributes.imagealttext}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="relative mt-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.attributes.name}
                    </h3>
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
                  <a
                    href={product.href}
                    className="relative flex bg-button rounded-2xl py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
                  >
                    Add to cart
                    <span className="sr-only">{product.attributes.name}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

export async function getServerSideProps(context) {
  console.log("context is:");
  console.log(context);
  const request = getStrapiURL(
    `/api/categories?filters[name][$eq]=${context.params.category}&populate[0]=products&populate[1]=products.itemimage`
  );
  console.log(request);
  const { data } = await axios.get(request, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
    },
  });
  const results = data.data[0];
  return { props: { results } };
}
