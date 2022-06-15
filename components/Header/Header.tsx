import { IoIosHeart } from "react-icons/io";
import { IoBasketSharp } from "react-icons/io5";
import Link from "next/link";
import Login from "./Login";
import { CartState } from "../../context/Context";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import fetcher from "../../lib/fetcher";
import useSWR, { SWRResponse } from "swr";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";
import { trpc } from "@/utils/trpc";
import { squareRouter } from "@/backend/router/square";

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    // function to run on scroll
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection, { passive: true }); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    };
  }, [scrollDirection]); // run when scroll direction changes

  return scrollDirection;
}

export const Header = (props): JSX.Element => {
  console.log(props);
  const scrollDirection = useScrollDirection();
  const { cart }: { cart: Product[] } = CartState();
  const [navigation, setNavigation] = useState<Category[]>();
  const { data }: SWRResponse = useSWR("/api/fetchcategories", fetcher);
  const trpcContext = trpc.useContext();

  const slugify = (string: string): string => {
    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  useEffect(() => {
    trpcContext
      .fetchQuery(["categories"], {
        staleTime: Infinity,
      })
      .then((result) => setNavigation(result));
  }, []);

  return (
    <>
      <div
        className={`h-max sticky z-50 ${
          scrollDirection === "down"
            ? "transition-all duration-700 -top-24"
            : "transition-all duration-700 top-0"
        }`}
      >
        <div className="flex flex-col">
          <div className="bg-paper-bg bg-cover h-11 drop-shadow-[0_-7px_5px_rgba(0,0,0,0.31)] bg-opacity-10">
            <div className="flex justify-around items-center md:justify-between lg:mx-36">
              <Link href="/">
                <div className="ml-2 sm:ml-10 text-[21px] text-header-brown font-gothic py-2 lg:py-0 lg:text-[34px] cursor-pointer flex whitespace-nowrap">
                  the cheek co.
                </div>
              </Link>
              <Link href="/cart">
                <div className="ml-10 mb-3 cursor-pointer sm:block relative sm:absolute top-3 right-3 lg:right-20 md:rounded-full md:bg-white md:border-text-secondary md:bg-opacity-100 md:z-[100] md:shadow-text-primary md:shadow-md md:w-[65px] md:h-[65px]">
                  <IoBasketSharp
                    className={
                      cart.length > 0
                        ? `h-6 w-6 sm:h-12 sm:w-12 text-shopping-cart opacity-100 m-2`
                        : `h-8 w-8 sm:h-12 sm:w-12 text-shopping-cart opacity-100 -translate-y-2 sm:translate-y-0 m-2`
                    }
                  />
                  {cart.length > 0 && (
                    <div className="absolute -top-1 -left-1 bg-shopping-cart-badge w-5 h-5 rounded-full justify-center items-center flex text-white">
                      {cart.length}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex items-center justify-between font-gothic text-header-brown">
                {/* Mobile Menu */}
                <div className="pl-10">
                  <div className="sm:hidden p-1.5 active:bg-black rounded-md active:bg-opacity-10">
                    {navigation && <MobileMenu navigation={navigation} />}
                  </div>
                </div>
                <div className="flex items-center justify-center sm:space-x-8 whitespace-nowrap">
                  {/* Eco Innovation */}
                  <span className="hidden sm:block font-medium font-gothic">
                    Eco Innovation
                  </span>
                  {/* Wishlist */}
                  <div className="relative h-5">
                    <div className="hidden md:block h-full w-full">
                      <div className="absolute top-0 w-full h-full space-x-1 justify-center items-center ">
                        <div className="mx-auto">
                          <Link href={"/wishlist"}>
                            <div className="group cursor-pointer">
                              <div className="flex flex-col items-center group-hover:-translate-y-1">
                                <IoIosHeart className="w-5 h-5 group-hover:w-4 group-hover:h-4 group-hover:animate-pulse group-hover:ease-in-out" />
                                <span className="text-xs hidden translate-y-6 group-hover:block group-hover:transform group-hover:-translate-y-0 group-hover:transition group-hover:duration-1000 group-hover:ease-in-out">
                                  Wishlist
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Login */}
                  <div className="sm:pl-0 sm:pr-24 lg:pr-10">
                    <Login />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-header-brown text-header-text text-[10px] font-gothic bg-opacity-90 h-5 sm:h-auto">
            <ul className="hidden sm:flex justify-center pl-3 sm:space-x-6">
              {navigation &&
                navigation?.length > 0 &&
                navigation
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .filter((item) => item.category_data.name.charAt(0) != "_")
                  .map((nav, i) => {
                    return (
                      <Link
                        key={nav.id}
                        href="/shop/[id]/"
                        as={`/shop/${slugify(nav.category_data.name)}`}
                      >
                        <li
                          key={i}
                          className="px-1.5 py-1 hover:transform hover:transition-all hover:scale-125 cursor-pointer h-full"
                        >
                          <span className="font-gothic font-normal text-xs capitalize">
                            {nav.category_data.name}
                          </span>
                        </li>
                      </Link>
                    );
                  })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
