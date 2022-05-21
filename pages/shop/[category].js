import { React } from "react";
import axios from "axios";
import { getStrapiURL } from "../../utils/api";

const CategoryPage = ({ results }) => {
  //console.log(results.attributes.products);
  const products = results.attributes.products;

  return (
    <div>
      <div>
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">
            {results.attributes.displayname}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {products.data.map((product) => (
              <div key={product.id}>
                <div className="relative">
                  <div className="relative w-full h-72 rounded-lg overflow-hidden">
                    <img
                      src={`${product.attributes?.itemimage?.data?.attributes?.url}`}
                      alt={product.attributes.imagealttext}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="relative mt-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.attributes.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                    />
                    <p className="relative text-lg font-semibold text-white">
                      $
                      {product.attributes.price
                        .toFixed(2)
                        .toLocaleString("en-us")}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href={product.href}
                    className="relative flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
                  >
                    Add to bag
                    <span className="sr-only">, {product.attributes.name}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        )
      </div>
    </div>
  );
};

export default CategoryPage;

export async function getServerSideProps(context) {
  const request = getStrapiURL(
    `/api/categories?filters[name][$eq]=${context.query.category}&populate[0]=products&populate[1]=products.itemimage`
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
