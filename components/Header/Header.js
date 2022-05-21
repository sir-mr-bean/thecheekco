import Image from "next/image";
import { MdArrowDropDown } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosHeart } from "react-icons/io";
import Link from "next/link";

export const Header = ({ navigation }) => {
  return (
    <div className="h-max sticky top-2 md:top-2 z-50">
      <div className="flex flex-col pt-4 md:pt-2">
        <div className="bg-paper-bg bg-cover bg-blend-lighten h-11 drop-shadow-[0_-7px_5px_rgba(0,0,0,0.31)] opacity-90">
          <div className="flex justify-start gap-16 items-center pb-2 md:justify-around lg:mx-36">
            <div className="ml-2 text-[21px] text-header-brown font-gothic pb-3 sm:pb-0 sm:py-2 lg:py-0 lg:text-[34px]">
              the cheek co.
            </div>
            <div className="pt-0.5 pl-16">
              <div className="active:bg-black rounded-md active:bg-opacity-10 py-1.5 px-1.5 md:hidden">
                <GiHamburgerMenu size={21} className="fill-slate-800" />
              </div>
            </div>
            <div className="hidden md:flex font-gothic text-header-brown gap-6">
              <div>Eco Innovation</div>
              <div>
                <IoIosHeart size={21} />
              </div>
              <div className="flex">
                Login
                <div>
                  <MdArrowDropDown size={21} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-header-brown text-header-text text-[13px] font-gothic py-1">
          <ul className="flex justify-center gap-9 pl-3">
            {navigation?.data &&
              navigation?.data.data
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .map((nav) => {
                  return (
                    <Link
                      key={nav.id}
                      href="/shop/[id]/"
                      as={`/shop/${nav.attributes.name}`}
                    >
                      <li key={nav.id}>
                        <span>{nav.attributes.displayname}</span>
                      </li>
                    </Link>
                  );
                })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
