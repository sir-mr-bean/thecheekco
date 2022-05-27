import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { getStrapiURL } from "../utils/api";

export default function Home({ data }) {
  const categories = data?.data;
  console.log(categories?.[0].attributes?.products.data.length);
  console.log(
    Math.ceil(
      Math.random() * categories?.[0].attributes?.products?.data.length + 1
    )
  );
  console.log(
    categories?.[0].attributes?.products?.data?.[
      Math.floor(Math.random() * categories?.[0].attributes?.products?.length) +
        1
    ]?.attributes
  );
  const offers = [
    {
      name: "On all local orders from Mossman to Mission Beach",
      description: "Free Shipping",
      href: "#",
    },
    {
      name: "Return when you're ready",
      description: "60 days of free returns",
      href: "#",
    },
    {
      name: "Sign up for our newsletter",
      description: "15% off your first order",
      href: "#",
    },
  ];

  // const categories = [
  //   {
  //     name: "New Arrivals",
  //     href: "#",
  //     imageSrc:
  //       "https://tailwindui.com/img/ecommerce-images/home-page-01-category-01.jpg",
  //   },
  //   {
  //     name: "Productivity",
  //     href: "#",
  //     imageSrc:
  //       "https://tailwindui.com/img/ecommerce-images/home-page-01-category-02.jpg",
  //   },
  //   {
  //     name: "Workspace",
  //     href: "#",
  //     imageSrc:
  //       "https://tailwindui.com/img/ecommerce-images/home-page-01-category-04.jpg",
  //   },
  //   {
  //     name: "Accessories",
  //     href: "#",
  //     imageSrc:
  //       "https://tailwindui.com/img/ecommerce-images/home-page-01-category-05.jpg",
  //   },
  //   {
  //     name: "Sale",
  //     href: "#",
  //     imageSrc:
  //       "https://tailwindui.com/img/ecommerce-images/home-page-01-category-03.jpg",
  //   },
  // ];

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

  return (
    <div>
      <div>
        <nav
          aria-label="Offers"
          className="order-last lg:order-first my-1 sm:my-3 "
        >
          <div className="max-w-7xl mx-auto lg:px-8">
            <ul
              role="list"
              className="grid grid-cols-3  divide-text-primary divide-x"
            >
              {offers.map((offer) => (
                <li key={offer.name} className="flex flex-col ">
                  <a
                    href={offer.href}
                    className="relative flex-1 flex flex-col justify-between pt-3 sm:py-6 px-2 text-center focus:z-10"
                  >
                    <p className="text-xs sm:text-sm text-text-secondary">
                      {offer.name}
                    </p>
                    <p className="font-semibold text-text-primary mx-auto">
                      {offer.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="relative">
          {/* Decorative image and overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden bg-gradient-to-b from-transparent via-bg-tan"
          >
            <img
              src="https://images.unsplash.com/photo-1523772354886-34a1dc2f72e7?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736"
              alt=""
              className="w-full h-full object-center object-cover  opacity-30"
            />
          </div>

          <div className="relative max-w-3xl mx-auto py-12 sm:py-16 px-6 flex flex-col items-center text-center md:py-32 lg:py-44 lg:px-0 font-gothic">
            <RoughNotation
              type="underline"
              show={true}
              iterations={3}
              strokeWidth={3}
              animationDelay={1000}
              animationDuration={1200}
              color="#602d0d"
              padding={5}
            >
              <h1 className="text-4xl font-light tracking-tight text-text-primary lg:text-6xl">
                100% Plastic Free
              </h1>
            </RoughNotation>
            <p className="mt-4 text-xl text-text-primary prose prose-blockquote:text-text-primary">
              We take great pride in our eco innovation, from 100% compostable
              mailers down to eco friendly inks and tapes.
              <blockquote className="py-2 stylistic-quote-mark">
                "Australia produces almost 3 million tonnes of plastic per
                annum, of which less than 12% is recycled."
                <cite className="text-sm">- WWF 2021</cite>
              </blockquote>
              Let's get cheeky and take the little steps to save our planet.
            </p>
            <a
              href="#"
              className="mt-8 inline-block bg-button border border-transparent rounded-md py-3 px-8 text-base font-medium text-text-secondary hover:border-black"
            >
              Browse collections
            </a>
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
                className="text-2xl font-extrabold tracking-tight text-text-secondary"
              >
                Shop by Category
              </h2>
              <a
                href="#"
                className="hidden text-sm font-semibold text-text-primary hover:text-text-secondary sm:block"
              >
                Browse all categories<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            <div className="mt-4 flow-root">
              <div className="-my-2">
                <div className="box-content py-2 relative h-96 overflow-x-auto xl:overflow-visible">
                  <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
                    {categories &&
                      categories.map((category) => (
                        <a
                          key={category?.attributes.displayname}
                          href={category.href}
                          className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                        >
                          <span aria-hidden="true" className="absolute inset-0">
                            <img
                              src={
                                category?.attributes?.products?.data?.[
                                  Math.floor(
                                    Math.random() *
                                      categories?.[0].attributes?.products?.data
                                        .length
                                  )
                                ]?.attributes.itemimage?.data?.attributes?.url
                              }
                              alt=""
                              className="w-full h-full object-center object-cover"
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                          />
                          <span className="relative mt-auto text-center text-xl font-bold text-button">
                            {category?.attributes.displayname}
                          </span>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 sm:hidden">
              <a
                href="#"
                className="block text-sm font-semibold text-text-primary hover:text-text-secondary"
              >
                Browse all categories<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </section>

          {/* Featured section */}
          <section
            aria-labelledby="social-impact-heading"
            className="max-w-7xl mx-auto pt-24 px-4 sm:pt-32 sm:px-6 lg:px-8"
          >
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg"
                  alt=""
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
                <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
                  <h2
                    id="social-impact-heading"
                    className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl"
                  >
                    <span className="block sm:inline">Level up</span>
                    <span className="block sm:inline">your desk</span>
                  </h2>
                  <p className="mt-3 text-xl text-text-primary">
                    Make your desk beautiful and organized. Post a picture to
                    social media and watch it get more likes than life-changing
                    announcements. Reflect on the shallow nature of existence.
                    At least you have a really nice desk setup.
                  </p>
                  <a
                    href="#"
                    className="mt-8 w-full block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-text-secondary hover:bg-gray-100 sm:w-auto"
                  >
                    Shop Workspace
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Collection section */}
          <section
            aria-labelledby="collection-heading"
            className="max-w-xl mx-auto pt-24 px-4 sm:pt-32 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <h2
              id="collection-heading"
              className="text-2xl font-extrabold tracking-tight text-text-secondary"
            >
              Shop by Collection
            </h2>
            <p className="mt-4 text-base text-gray-500">
              Each season, we collaborate with world-class designers to create a
              collection inspired by the natural world.
            </p>

            <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              {collections.map((collection) => (
                <a
                  key={collection.name}
                  href={collection.href}
                  className="group block"
                >
                  <div
                    aria-hidden="true"
                    className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden group-hover:opacity-75 lg:aspect-w-5 lg:aspect-h-6"
                  >
                    <img
                      src={collection.imageSrc}
                      alt={collection.imageAlt}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-secondary">
                    {collection.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {collection.description}
                  </p>
                </a>
              ))}
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
