import { getStrapiURL } from "../../utils/api";
import Link from "next/link";

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

export default function shop({ data }) {
  const categories = data.data;
  const item = categories?.[0].attributes.products.data;
  //console.log(item);

  const result = item.splice(3, 10);

  console.log(result);

  return (
    <>
      {categories &&
        categories.map((category) => {
          return (
            <div key={category.id} className="bg-white">
              <div className="max-w-2xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                  <h2 className="text-2xl font-light tracking-tight text-text-primary">
                    {category.attributes.displayname}
                  </h2>
                  <Link
                    href={`/shop/[category]/`}
                    as={`/shop/${category.attributes.name}`}
                  >
                    <span className="hidden text-sm font-medium text-text-primary hover:text-text-secondary md:block cursor-pointer">
                      Shop the collection<span aria-hidden="true"> &rarr;</span>
                    </span>
                  </Link>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                  {category.attributes.products.data
                    .slice(0, 4)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="group relative cursor-pointer"
                      >
                        <div className="w-full h-56 bg-gray-200 rounded-md overflow-hidden  lg:h-72 xl:h-80 border border-text-secondary">
                          <img
                            src={
                              product.attributes.itemimage.data?.attributes.url
                            }
                            alt={product.imageAlt}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">
                          <a href={product.href}>
                            <span className="absolute inset-0" />
                            {product.attributes.name}
                          </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.color}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${product.attributes.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="mt-8 text-sm md:hidden">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Shop the collection<span aria-hidden="true"> &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}

export const getStaticProps = async () => {
  const productsURL = getStrapiURL(
    `/api/categories?populate[0]=products&populate[1]=products.itemimage&populate[2]=products.categories`
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
