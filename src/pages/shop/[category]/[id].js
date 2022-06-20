import { Fragment, useRef } from "react";
import { Tab } from "@headlessui/react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Image from "next/image";
import showdown from "showdown";
import ReactHtmlParser from "react-html-parser";
import { CartState } from "../../../../context/Context";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const reviews = {
  average: 4,
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
        <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
      `,
      date: "July 16, 2021",
      datetime: "2021-07-16",
      author: "Emily Selman",
      avatarSrc:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
    {
      id: 2,
      rating: 5,
      content: `
        <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
      `,
      date: "July 12, 2021",
      datetime: "2021-07-12",
      author: "Hector Gibbons",
      avatarSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
    // More reviews...
  ],
};
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
const license = {
  href: "#",
  summary:
    "For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.",
  content: `
    <h4>Overview</h4>
    
    <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
    
    <ul role="list">
    <li>You\'re allowed to use the icons in unlimited projects.</li>
    <li>Attribution is not required to use the icons.</li>
    </ul>
    
    <h4>What you can do with it</h4>
    
    <ul role="list">
    <li>Use them freely in your personal and professional work.</li>
    <li>Make them your own. Change the colors to suit your project or brand.</li>
    </ul>
    
    <h4>What you can\'t do with it</h4>
    
    <ul role="list">
    <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
    <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
    </ul>
  `,
};

const Markdown = (content) => {
  var converter = new showdown.Converter();
  var html = converter.makeHtml(content.content);
  return (
    <div className="bg-transparent text-text-primary font-gothic prose prose-stone py-3">
      {ReactHtmlParser(html)}
    </div>
  );
};

const Product = ({ data }) => {
  const quantity = useRef(null);
  const { cart, dispatch } = CartState();
  const product = data?.[0];
  console.log(data);

  const handleAdd = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      item: product,
      qty: parseInt(quantity.current.value),
    });
    if (window !== undefined) {
    }
    toast.custom((t) => (
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
                  product.image ||
                  "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                }
                alt={product.name}
              />
            </div>
            <div className="ml-3 flex-1 my-auto">
              <p className="mt-1 text-sm text-text-primary font-gothic">
                {quantity.current.value} {product.name} added to cart.
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
                  src={product.image}
                  alt={product.name}
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Product details */}
              <div className="max-w-xl sm:max-w-none border rounded-lg bg-white sm:px-10 flex flex-col justify-around w-full px-4">
                <div className="flex flex-col space-y-2 items-center justify-center">
                  <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl px-3 pt-4">
                    {product.name}
                  </h1>

                  <h2 id="information-heading" className="sr-only">
                    Product information
                  </h2>
                  <div>
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <AiOutlineStar
                          key={rating}
                          className={classNames(
                            reviews.average > rating
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                  </div>
                </div>

                <p className="text-text-primary mt-6 p-3"></p>
                <div className="flex justify-between items-center space-x-10">
                  <button
                    onClick={() => handleAdd(product)}
                    type="button"
                    className="mt-3 uppercase bg-button border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
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
                      className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm rounded-md border text-black"
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
                  <span className="text-black text-2xl">
                    $
                    {(
                      product.variations?.[0]?.item_variation_data?.price_money
                        ?.amount / 100
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
            <div className="lg:mt-0 lg:col-span-4 bg-white rounded-lg flex justify-start items-center pb-20 px-4">
              <Tab.Group as="div">
                <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex space-x-8">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-text-primary text-text-primary"
                            : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                          "whitespace-nowrap py-6 border-b-2 font-medium text-base"
                        )
                      }
                    >
                      Additional Info
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-text-primary text-text-primary"
                            : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                          "whitespace-nowrap py-6 border-b-2 font-medium text-base"
                        )
                      }
                    >
                      FAQ
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-text-primary text-text-primary"
                            : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                          "whitespace-nowrap py-6 border-b-2 font-medium text-base"
                        )
                      }
                    >
                      License
                    </Tab>
                  </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                  <Tab.Panel className="-mb-10">
                    <h3 className="sr-only">Additional Info</h3>
                    <Markdown content={product.description} />
                  </Tab.Panel>

                  <Tab.Panel className="text-sm text-gray-500">
                    <h3 className="sr-only">Frequently Asked Questions</h3>

                    <dl>
                      {faqs.map((faq) => (
                        <Fragment key={faq.question}>
                          <dt className="mt-10 font-medium text-gray-900">
                            {faq.question}
                          </dt>
                          <dd className="mt-2 prose prose-sm max-w-none text-gray-500">
                            <p>{faq.answer}</p>
                          </dd>
                        </Fragment>
                      ))}
                    </dl>
                  </Tab.Panel>

                  <Tab.Panel className="pt-10">
                    <h3 className="sr-only">License</h3>

                    <div className="max-w-none text-gray-500">
                      {license.content}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getStaticPaths = async () => {
  const productsURL = `https://thecheekco.vercel.app/api/fetchproducts`;
  console.log(productsURL);
  const productsResult = await fetch(productsURL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "*",
    },
  });

  const productsData = await productsResult.json();

  if (!productsResult.ok) {
    throw new Error(
      `Failed to fetch paths for [id].js, received status ${productsResult.status}`
    );
  }
  //console.log(productsData?.[0].filter((i) => i.category?.category_data));
  return {
    paths: productsData?.[0]
      .filter((i) => i.category?.category_data.name)
      .map((item) => ({
        params: {
          id: item?.name.toLowerCase().replaceAll(" ", "-").toString(),
          category:
            item?.category?.category_data.name
              .toLowerCase()
              .replaceAll(" ", "-") || null,
        },
      })),
    fallback: true,
  };
};

export async function getStaticProps({ params }) {
  const productName = params.id.replaceAll("-", " ");
  const productsURL = `https://thecheekco.vercel.app/api/fetchproducts`;
  const productRes = await fetch(productsURL, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!productRes.ok) {
    throw new Error(
      `Failed to fetch props for [id].js, received status ${productRes.status}`
    );
  }
  const dataResult = await productRes.json();
  //console.log(dataResult?.[0]);
  const currentProduct = dataResult?.[0].filter(
    (item) =>
      item.name.toLowerCase().replaceAll(" ", "-").toString() === params.id
  );
  //console.log(currentProduct?.[0]);
  const data = currentProduct;
  return {
    props: { data },
  };
}

export default Product;
