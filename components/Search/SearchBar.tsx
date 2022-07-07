import { trpc } from "@/utils/trpc";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { IconBase } from "react-icons/lib";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchIconRef = useRef<HTMLDivElement>(null);
  const closeSearchRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useContext();
  const { data: product, status } = trpc.useQuery([
    "square-products.search-product",
    {
      productName: search,
    },
  ]);

  console.log(product);
  console.log(status);

  useEffect(() => {
    const searchIcon = document.getElementById("search-icon");
    function handleClickOutside(event: any) {
      console.log(event.target.id);
      console.log("element is ", searchIcon);
      console.log(isOpen);
      if (searchRef.current) {
        if (
          !searchRef.current.contains(event.target) &&
          event.target.id !== "search-icon"
        ) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    console.log(isOpen);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchRef, searchIconRef, closeSearchRef]);

  return (
    <>
      <div
        id="searchbar-wrapper"
        className="relative flex w-48 cursor-pointer items-center justify-end"
      >
        <input
          id="searchbar"
          type="text"
          ref={searchRef}
          className={
            isOpen
              ? `h-8 w-full origin-right transform appearance-none rounded-full border  border-text-secondary bg-bg-tan bg-opacity-100 p-1 pl-3 text-text-primary opacity-100 transition-[width] duration-1000 ease-in-out focus:border-text-primary focus:ring-text-primary sm:text-base`
              : `h-6 w-6 origin-right transform rounded-full border border-text-secondary bg-bg-tan transition-[width] duration-1000 ease-in-out`
          }
          onChange={(e) => {
            setSearch(e.target.value);
            utils.refetchQueries([
              "square-products.search-product",
              {
                productName: e.target.value,
              },
            ]);
          }}
        />
        <div
          ref={searchIconRef}
          onClick={() => {
            isOpen ? setIsOpen(false) : setIsOpen(true);
          }}
        >
          {isOpen ? (
            <AiOutlineClose
              id="close-search"
              onClick={() => setIsOpen(false)}
              className="absolute right-1 top-1.5 h-5 w-5 transform text-text-primary opacity-100 transition-all duration-1000 ease-out"
            />
          ) : (
            <AiOutlineSearch
              id="search-icon"
              onClick={() => setIsOpen(true)}
              className="absolute right-[3px] top-0.5 h-5 w-5 transform text-text-primary opacity-100 transition-all duration-1000 ease-out"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
