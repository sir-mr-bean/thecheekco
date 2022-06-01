import { getStrapiURL } from "../../utils/api";
import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Leather Long Wallet",
    color: "Natural",
    price: "$75",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-04-trending-product-02.jpg",
    imageAlt: "Hand stitched, orange leather long wallet.",
  },
  // More products...
];

export default function shop({ categoriesData, productsData }) {
  const categories = categoriesData.filter(
    (category) => !category.category_data.name.startsWith("_")
  );
  const products = productsData?.[0];
  console.log(products);
  return (
    <div className="mx-2 sm:mx-10 px-4 bg-white shadow-md shadow-black text-text-primary font-gothic">
      <div className="flex flex-wrap justify-between">
        <div className="w-full">
          <div className="flex flex-wrap justify-between divide-y">
            {products.length &&
              categories.map((category) => (
                <div className="w-full sm:px-4 sm:mx-10">
                  <div className="relative">
                    <Link
                      href="/shop/[category]"
                      as={`/shop/${category.category_data.name
                        .replace(/ /g, "-")
                        .toLowerCase()}`}
                    >
                      <a className="block w-full md:w-1/2 px-4">
                        <div className="relative py-5 space-y-2">
                          <h3 className="text-2xl font-medium text-text-primary">
                            {category.category_data.name}
                          </h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-wrap md:gap-1 w-full justify-start sm:justify-start xl:justify-evenly items-center">
                    {products
                      .filter(
                        (item) =>
                          item.category?.category_data.name ===
                          category.category_data.name
                      )
                      .map((product, i) => {
                        console.log(product.image);
                        while (i < 6)
                          return (
                            <div className="w-fit h-fit space-y-2 sm:px-4 mx-auto">
                              <div className="relative">
                                <Link
                                  href="/shop/[category]/[id]"
                                  as={`/shop/${product?.category?.category_data?.name
                                    .replace(/ /g, "-")
                                    .toLowerCase()}/${product.name
                                    .replace(/ /g, "-")
                                    .toLowerCase()}`}
                                >
                                  <a className="px-4 ">
                                    <div className="flex sm:flex-col justify-between items-start space-x-2">
                                      <div className="relative w-64 min-w-xl">
                                        <Image
                                          src={
                                            product.image ||
                                            "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                          }
                                          alt={product.name}
                                          width={1920}
                                          height={1080}
                                          layout="responsive"
                                          className="object-center object-cover rounded-lg"
                                        />
                                      </div>
                                      <div className="relative mt-4 flex flex-col sm:flex-row items-center justify-between w-full">
                                        <h1 className="text-sm font-medium sm:whitespace-nowrap">
                                          {product.name}
                                        </h1>
                                        <h3 className="text-xs font-medium sm:whitespace-nowrap pr-2">
                                          $
                                          {(
                                            product.variations?.[0]
                                              ?.item_variation_data?.price_money
                                              ?.amount / 100
                                          ).toFixed(2)}
                                        </h3>
                                      </div>
                                    </div>
                                  </a>
                                </Link>
                              </div>
                            </div>
                          );
                      })}
                    <div className="w-full flex justify-end items-center py-1 cursor-pointer">
                      <Link
                        href="/shop/[category]"
                        as={`/shop/${category.category_data.name
                          .replace(/ /g, "-")
                          .toLowerCase()}`}
                      >
                        <span className="">
                          Browse all {category.category_data.name}
                          <span aria-hidden="true"> &rarr;</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-wrap justify-between"></div>
        </div>
      </div>
    </div>
  );

  // const categories = data.data;
  // const item = categories?.[0].attributes.products.data;
  // const result = item.splice(3, 10);

  // return (
  //   <>
  //     {categories &&
  //       categories.map((category) => {
  //         return (
  //           <div key={category.id} className="bg-white">
  //             <div className="max-w-2xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
  //               <div className="md:flex md:items-center md:justify-between">
  //                 <h2 className="text-2xl font-light tracking-tight text-text-primary">
  //                   {category.attributes.displayname}
  //                 </h2>
  //                 <Link
  //                   href={`/shop/[category]/`}
  //                   as={`/shop/${category.attributes.name}`}
  //                 >
  //                   <span className="hidden text-sm font-medium text-text-primary hover:text-text-secondary md:block cursor-pointer">
  //                     Shop the collection<span aria-hidden="true"> &rarr;</span>
  //                   </span>
  //                 </Link>
  //               </div>

  //               <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
  //                 {category.attributes.products.data
  //                   .slice(0, 4)
  //                   .map((product) => (
  //                     <div
  //                       key={product.id}
  //                       className="group relative cursor-pointer"
  //                     >
  //                       <div className="w-full h-56 bg-gray-200 rounded-md overflow-hidden  lg:h-72 xl:h-80 border border-text-secondary">
  //                         <img
  //                           src={
  //                             product.attributes.itemimage.data?.attributes.url
  //                           }
  //                           alt={product.imageAlt}
  //                           className="w-full h-full object-center object-cover"
  //                         />
  //                       </div>
  //                       <h3 className="mt-4 text-sm text-gray-700">
  //                         <a href={product.href}>
  //                           <span className="absolute inset-0" />
  //                           {product.attributes.name}
  //                         </a>
  //                       </h3>
  //                       <p className="mt-1 text-sm text-gray-500">
  //                         {product.color}
  //                       </p>
  //                       <p className="mt-1 text-sm font-medium text-gray-900">
  //                         ${product.attributes.price.toFixed(2)}
  //                       </p>
  //                     </div>
  //                   ))}
  //               </div>

  //               <div className="mt-8 text-sm md:hidden">
  //                 <a
  //                   href="#"
  //                   className="font-medium text-indigo-600 hover:text-indigo-500"
  //                 >
  //                   Shop the collection<span aria-hidden="true"> &rarr;</span>
  //                 </a>
  //               </div>
  //             </div>
  //           </div>
  //         );
  //       })}
  //   </>
  // );
}

export const getStaticProps = async ({ params }) => {
  const categoriesURL = `https://thecheekco.vercel.app/api/fetchcategories`;
  const categoriesResult = await fetch(categoriesURL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "*",
    },
  });
  const categoriesData = await categoriesResult.json();

  const productsURL = `https://thecheekco.vercel.app/api/fetchproducts`;
  const productsResult = await fetch(productsURL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "*",
    },
  });
  const productsData = await productsResult.json();

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
