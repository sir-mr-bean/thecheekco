import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import Carousel from "react-elastic-carousel";
import { useRef, useState } from "react";

export default function Home({ categoriesData, productsData }) {
  console.log(categoriesData);
  console.log(productsData);
  const carouselRef = useRef();
  const [activeItemIndex, setActiveItemIndex] = useState(0);

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
  console.log(carouselRef);
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
            <span className="mt-4 text-xl text-text-primary prose prose-blockquote:text-text-primary">
              We take great pride in our eco innovation, from 100% compostable
              mailers down to eco friendly inks and tapes.
              <blockquote className="py-2 stylistic-quote-mark">
                "Australia produces almost 3 million tonnes of plastic per
                annum, of which less than 12% is recycled."
                <cite className="text-sm">- WWF 2021</cite>
              </blockquote>
              Let's get cheeky and take the little steps to save our planet.
            </span>
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

            <Carousel
              ref={carouselRef}
              pagination={false}
              showArrows={false}
              itemsToShow={3}
              itemsToScroll={3}
              onChange={(currentItem) => setActiveItemIndex(currentItem.index)}
            >
              {categoriesData &&
                productsData &&
                categoriesData
                  ?.filter((item) => item.category_data.name.charAt(0) != "_")
                  .map((category) => {
                    // for each category name in category.category_data.name, find a random product from productsData that matches the category name and display it
                    const randomProduct = productsData?.[0].find(
                      (product) =>
                        product.category?.category_data?.name ===
                        category.category_data.name
                    );
                    console.log(randomProduct);
                    // return a carousel displaying 3 random products at a time
                    return (
                      <div
                        key={category.category_data.name}
                        className="flex justify-center items-center h-96 w-full m-4"
                      >
                        <div className="relative h-full w-full">
                          <div
                            className="absolute inset-0 overflow-hidden rounded-md"
                            style={{
                              backgroundImage: `url(${randomProduct?.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <div className="absolute w-1/2 right-0  bottom-2 z-10 flex flex-col justify-center">
                            <div className="px-4 py-2 bg-white bg-opacity-80 border border-transparent rounded-l-md shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 px-4">
                                  <h3 className="text-lg font-medium text-text-primary">
                                    {category.category_data.name}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </Carousel>
            <div className="flex justify-center items-center space-x-3">
              {categoriesData &&
                productsData &&
                categoriesData
                  ?.filter((item) => item.category_data.name.charAt(0) != "_")
                  .filter((item, i) => i % 2 === 0)
                  .map((category, i) => {
                    // for each category name in category.category_data.name, find a random product from productsData that matches the category name and display it
                    const randomProduct = productsData?.[0].find(
                      (product) =>
                        product.category?.category_data?.name ===
                        category.category_data.name
                    );
                    console.log(randomProduct);
                    return (
                      <button
                        className={
                          activeItemIndex === (i === 0 ? i : i + 1)
                            ? `inline-block bg-button border border-transparent rounded-full p-1.5 text-sm sm:text-base font-medium border-text-primary text-text-secondary hover:border-black`
                            : `inline-block bg-button border border-transparent rounded-full p-1.5 text-sm sm:text-base font-medium text-text-secondary hover:border-black`
                        }
                        key={i}
                        active={i >= activeItemIndex && i < activeItemIndex}
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
