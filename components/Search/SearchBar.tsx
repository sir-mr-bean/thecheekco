import { trpc } from "@/utils/trpc";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { IconBase } from "react-icons/lib";
import { CatalogObject } from "square";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogObject[]>([]);
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

  useEffect(() => {
    setSearchResults(product || []);
    if (status === "success" && product && product?.length > 0) {
      setIsSearching(false);
      setSearchResults(product);
    }
  }, [status, product, isSearching]);

  console.log("search results are ", searchResults);
  return (
    <>
      <div
        id="searchbar-wrapper"
        className="relative flex w-24 cursor-pointer items-center justify-end sm:w-48"
      >
        <input
          id="searchbar"
          type="text"
          ref={searchRef}
          className={
            isOpen
              ? `z-10 h-8 w-full origin-right transform appearance-none rounded-full border border-text-secondary bg-bg-tan bg-opacity-100 p-1 pl-3 text-xs text-text-primary opacity-100 transition-[width] duration-1000 ease-in-out focus:border-text-primary  sm:text-base`
              : isOpen && searchResults && searchResults.length > 0
              ? `z-10 h-8 w-full origin-right transform appearance-none rounded-full border-t border-text-secondary bg-bg-tan bg-opacity-100 p-1 pl-3 text-xs text-text-primary opacity-100 transition-[width] duration-1000 ease-in-out focus:border-text-primary  sm:text-base`
              : `z-10 h-6 w-6 origin-right transform rounded-full border border-text-secondary bg-bg-tan transition-[width] delay-500 duration-1000 ease-in-out`
          }
          onChange={(e) => {
            setSearch(e.target.value);
            setIsSearching(true);
            utils.refetchQueries([
              "square-products.search-product",
              {
                productName: e.target.value,
              },
            ]);
          }}
        />
        <div
          className={
            isOpen && searchResults && searchResults.length > 0
              ? `z-5 absolute top-1 h-48 w-full transform rounded-xl border-x border-b border-text-secondary bg-bg-tan transition-all delay-1000 duration-500 ease-in`
              : `z-5 absolute top-2 h-0 w-full transform rounded-xl bg-bg-tan transition-all duration-500 ease-in`
          }
        ></div>
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
              className="absolute right-1 top-1.5 z-20 h-5 w-5 transform text-text-primary opacity-100 transition-all duration-1000 ease-out"
            />
          ) : (
            <AiOutlineSearch
              id="search-icon"
              onClick={() => setIsOpen(true)}
              className="absolute right-[3px] top-0.5 z-20 h-5 w-5 transform text-text-primary opacity-100 transition-all duration-1000 ease-out"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
