import { IoIosHeart } from "react-icons/io";
import { IoBasketSharp } from "react-icons/io5";
import Link from "next/link";
import Login from "./Login";
import { CartState } from "../../context/Cart/Context";
import { Dispatch, useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import { Product } from "@/types/Product";
import { trpc } from "@/utils/trpc";
import { CatalogObject } from "square";
import { CartObject } from "@/types/CartObject";
import SearchBar from "../Search/SearchBar";
import HeaderBottom from "./HeaderBottom";

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

export const Header = (): JSX.Element => {
  const scrollDirection = useScrollDirection();
  const {
    cart,
    dispatch,
  }: {
    cart: CartObject[];
    dispatch: Dispatch<{
      type: string;
      item?: CartObject;
      quantity?: string;
      productImage?: string;
    }>;
  } = CartState();
  const categoryQuery = trpc.useQuery(["square-categories.all-categories"], {
    context: {
      skipBatch: true,
    },
  });
  const { data: navigation } = categoryQuery;
  //const [cartItems, setCartItems] = useState<CatalogObject[]>(cart || []);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // useEffect(() => {
  //   if (cart) {
  //     setCartItems(cart);
  //   }
  // }, [cart]);

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

  // if (!hasMounted) {
  //   return <></>;
  // }

  return (
    <>
      <div
        className={`sticky z-50 h-max  ${
          scrollDirection === "down"
            ? "-top-24 transition-all duration-700"
            : "top-0 transition-all duration-700"
        }`}
      >
        <div className="flex flex-col">
          <div className="h-11 bg-opacity-10 bg-paper-bg bg-cover drop-shadow-[0_-7px_5px_rgba(0,0,0,0.31)]">
            <div className="flex items-center justify-between md:justify-between lg:mx-36">
              <Link href="/">
                <div className="ml-2 flex cursor-pointer select-none whitespace-nowrap py-2 font-gothic text-[21px] text-header-brown sm:ml-10 lg:py-0 lg:text-[34px]">
                  the cheek co.
                </div>
              </Link>

              <div className="mr-3 flex items-center justify-between font-gothic text-header-brown">
                {/* Mobile Menu */}
                <SearchBar />

                <div className="rounded-md p-1.5 sm:hidden">
                  <MobileMenu />
                </div>

                <div className="flex items-center justify-center whitespace-nowrap sm:space-x-3 md:pl-8">
                  <div className="relative h-5">
                    <div className="hidden h-full w-full md:block">
                      <div className="absolute top-0 h-full w-full items-center justify-center space-x-1 ">
                        <div className="mx-auto">
                          <Link href={"/wishlist"}>
                            <div className="group cursor-pointer">
                              <div className="flex flex-col items-center group-hover:-translate-y-1">
                                <IoIosHeart className="h-5 w-5 group-hover:h-4 group-hover:w-4 group-hover:animate-pulse group-hover:ease-in-out" />
                                <span className="hidden translate-y-6 text-xs group-hover:block group-hover:-translate-y-0 group-hover:transform group-hover:transition group-hover:duration-1000 group-hover:ease-in-out">
                                  Wishlist
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/cart">
                    <a>
                      <div className="relative top-2 right-3 ml-5 mb-3 cursor-pointer sm:absolute sm:top-3 sm:block sm:rounded-full sm:bg-white sm:bg-opacity-100 md:h-[65px] md:w-[65px] md:border-text-secondary md:shadow-md md:shadow-text-primary lg:right-20">
                        {cart && hasMounted ? (
                          <IoBasketSharp className="m-2 h-6 w-6 -translate-y-0 text-shopping-cart opacity-100 sm:h-12 sm:w-12" />
                        ) : (
                          <IoBasketSharp className="m-2 h-8 w-8 -translate-y-0 text-shopping-cart opacity-100 sm:h-12 sm:w-12 sm:translate-y-0" />
                        )}
                        {cart && hasMounted && (
                          <div className="font-gothica absolute -top-3 -left-0 flex h-4 w-4 items-center justify-center rounded-full bg-text-secondary text-center text-xs font-semibold text-white sm:-top-1 sm:h-6 sm:w-6 sm:text-sm">
                            {cart.length}
                          </div>
                        )}
                      </div>
                    </a>
                  </Link>
                  {/* Login */}
                  <div className="sm:pl-0 sm:pr-24 lg:pr-10">
                    <Login />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <HeaderBottom />
        </div>
      </div>
    </>
  );
};

export default Header;
