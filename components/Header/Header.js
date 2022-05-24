import Image from "next/image";
import { MdArrowDropDown } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosHeart } from "react-icons/io";
import { IoBasketSharp } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";
import Login from "./Login";
import { useRouter } from "next/router";
import { CartState } from "../../context/Context";
import { useEffect, useState } from "react";
import { getStrapiURL } from "../../utils/api";
import axios from "axios";
import MobileMenu from "./MobileMenu";

export const Header = () => {
  const { cart, dispatch } = CartState();
  const [navigation, setNavigation] = useState([]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchNavigation = async () => {
      const request = getStrapiURL("/api/categories");
      const { data } = await axios.get(request, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
        },
      });
      return data?.data;
    };
    if (mounted) {
      fetchNavigation().then((res) => setNavigation(res));
    }
  }, [process.env.STRAPI_API_KEY, mounted, cart]);

  return (
    mounted && (
      <div className="h-max sticky top-2 md:top-2 z-50">
        <div className="flex flex-col pt-4 md:pt-2">
          <div className="bg-paper-bg bg-cover h-11 drop-shadow-[0_-7px_5px_rgba(0,0,0,0.31)] bg-opacity-10">
            <div className="flex justify-around items-center pb-2 md:justify-around lg:mx-36">
              <Link href="/">
                <div className="ml-2 text-[21px] text-header-brown font-gothic py-2 lg:py-0 lg:text-[34px] cursor-pointer">
                  the cheek co.
                </div>
              </Link>
              <Link href="/cart">
                <div className="ml-10 mb-3 cursor-pointer sm:block relative sm:absolute top-3 right-3 lg:right-20 md:rounded-full md:bg-white md:border-text-secondary md:bg-opacity-100 md:z-[100] md:shadow-text-primary md:shadow-md md:w-[65px] md:h-[65px]">
                  <IoBasketSharp className="h-6 w-6 sm:h-12 sm:w-12 text-shopping-cart opacity-100 m-2" />
                  <div className="absolute -top-1 -left-1 bg-shopping-cart-badge w-5 h-5 rounded-full justify-center items-center flex text-white">
                    {cart?.length || 0}
                  </div>
                </div>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="pt-0.5 pl-16">
                  <div className="sm:hidden p-1.5 active:bg-black rounded-md active:bg-opacity-10">
                    <MobileMenu navigation={navigation} />
                  </div>
                </div>
                <div className="hidden md:flex font-gothic text-header-brown">
                  <div className="flex space-x-1 justify-center items-center ">
                    <span>Eco Innovation</span>
                    <div>
                      <IoIosHeart size={21} />
                    </div>
                  </div>
                </div>
                <div className="font-gothic text-header-brown sm:pr-16">
                  <Login />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-header-brown text-header-text text-[10px] font-gothic py-1 bg-opacity-90 h-5 sm:h-auto">
            <ul className="hidden sm:flex justify-center sm:gap-3 pl-3 sm:space-x-1">
              {navigation &&
                navigation
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .map((nav, i) => {
                    return (
                      <Link
                        key={nav.id}
                        href="/shop/[id]/"
                        as={`/shop/${nav.attributes.name}`}
                      >
                        <li key={i}>
                          <div className="px-1 hover:transform hover:transition-all hover:scale-125 cursor-pointer">
                            <span className="font-gothic font-normal text-xs">
                              {nav.attributes.displayname}
                            </span>
                          </div>
                        </li>
                      </Link>
                    );
                  })}
            </ul>
          </div>
        </div>
      </div>
    )
  );
};

export default Header;
