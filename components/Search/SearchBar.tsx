import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { IconBase } from "react-icons/lib";
import { BeatLoader } from "react-spinners";
import { CatalogObject } from "square";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogObject[]>([]);
  const [catSearchResults, setCatSearchResults] = useState<string[]>([]);
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
  const { data: subcategories, status: subCatStatus } = trpc.useQuery([
    "square-products.get-product-subcategories",
  ]);
  console.log(subcategories);

  console.log(product);
  useEffect(() => {
    const searchIcon = document.getElementById("search-icon");
    function handleClickOutside(event: any) {
      if (searchRef.current) {
        if (
          !searchRef.current.contains(event.target) &&
          event.target.id !== "search-icon"
        ) {
          setSearch("");
          searchRef.current.value = "";
          setIsOpen(false);
          setIsSearching(false);
          setSearchResults([]);
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchRef, searchIconRef, closeSearchRef]);

  useEffect(() => {
    setSearchResults(product || []);
    setCatSearchResults([]);
    if (status === "success" && product && product?.length > 0) {
      setSearchResults(product);
      if (subCatStatus === "success" && subcategories) {
        searchResults.forEach((result) => {
          const subCat =
            subcategories?.customAttributeDefinitionData?.selectionConfig?.allowedSelections?.find(
              (sub) =>
                result.itemData?.variations?.[0]?.customAttributeValues?.[
                  "Square:c373acb7-e030-422a-bbcc-aae6e4f11958"
                ]?.selectionUidValues?.[0] === sub.uid
            );
          if (subCat) {
            // push subCat.name to catSearchResults if unique
            if (!catSearchResults.includes(subCat.name)) {
              setCatSearchResults((prev) => [...prev, subCat.name]);
            }
          }
        });
      }
      setIsSearching(false);
    }
  }, [status, product, subcategories, subCatStatus, isSearching]);

  console.log(catSearchResults);
  return (
    <>
      <div
        id="searchbar-wrapper"
        className="w-42 relative flex cursor-pointer items-center justify-end font-gothic md:w-52 lg:w-64"
      >
        <label className="sr-only" htmlFor="searchbar" />
        <input
          id="searchbar"
          type="text"
          ref={searchRef}
          className={
            isOpen && searchResults && searchResults.length > 0
              ? `z-10 h-8 w-full origin-right transform appearance-none rounded-t-xl border border-x-text-secondary border-t-text-secondary border-b-transparent bg-bg-tan bg-opacity-100 p-1 pl-3 text-xs text-text-primary opacity-100 transition-[width] delay-1000 duration-1000 ease-in-out focus:border-x-text-secondary focus:border-t-text-secondary focus:border-b-transparent  focus:ring-0 sm:text-base`
              : isOpen
              ? `z-10 h-8 w-full origin-right transform appearance-none rounded-full border border-text-secondary bg-bg-tan bg-opacity-100  p-1 pl-3 text-xs text-text-primary opacity-100 ring-0 transition-[width] duration-1000 ease-in-out focus:border-0 focus:border-text-primary  focus:ring-0  sm:text-base`
              : `z-10 h-6 w-6 origin-right transform rounded-full border border-text-secondary bg-bg-tan transition-[width] delay-500 duration-1000 ease-in-out`
          }
          onChange={(e) => {
            utils.invalidateQueries([
              "square-products.search-product",
              {
                productName: search,
              },
            ]);
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
              ? `z-5 absolute top-1 mt-7 h-48 w-full transform overflow-y-auto rounded-b-xl border-x border-b border-text-secondary bg-bg-tan pr-2 transition-all duration-100 ease-in scrollbar-thin scrollbar-thumb-text-primary `
              : `z-5 absolute top-2 h-0 w-full transform rounded-xl bg-bg-tan transition-all duration-500 ease-in`
          }
        >
          {/* <div className="w-full rounded-xl border-t border-text-secondary ">
            <span className="pl-2">Categories</span>
          </div>
          <div className="w-full rounded-xl border-t border-text-secondary">
            <span className="pl-2">Products</span>
          </div> */}
          {searchResults
            .filter((result) => result.type === "ITEM")
            .map((result) => {
              const productImage = searchResults?.find(
                (p) =>
                  p.type === "IMAGE" &&
                  result.itemData?.imageIds?.includes(p.id)
              );
              const productCategory = searchResults?.find(
                (p) =>
                  p.type === "CATEGORY" &&
                  result.itemData?.categoryId?.includes(p.id)
              );

              return (
                <div className="flex w-full items-center justify-between px-1.5 py-1  text-text-primary hover:bg-text-secondary hover:text-bg-tan">
                  <Link
                    href="/shop/[category]/[id]"
                    as={`/shop/${productCategory?.categoryData?.name
                      ?.replace(/ /g, "-")
                      .toLowerCase()}/${result.itemData?.name
                      ?.replace(/ /g, "-")
                      .toLowerCase()}`}
                  >
                    <a className="w-full">
                      <div className="relative flex w-full items-center justify-center">
                        {/* <div className="relative h-6 w-6">
                          <Image
                            src={
                              productImage?.imageData?.url ||
                              "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                            }
                            alt={result.itemData?.name}
                            className="h-6 w-6 rounded-full"
                            width={60}
                            height={60}
                            layout="responsive"
                          />
                        </div> */}

                        <span className="text-xs">{result.itemData?.name}</span>
                      </div>
                    </a>
                  </Link>
                  {/* <span className="text-xs  sm:text-sm">
                  $
                  {(
                    parseInt(
                      parseInt(
                        result.itemData?.variations?.[0].itemVariationData?.priceMoney?.amount?.toString() as string
                      ).toFixed(2)
                    ) / 100
                  ).toFixed(2)}
                </span> */}
                </div>
              );
            })}
        </div>
        <div
          ref={searchIconRef}
          onClick={() => {
            isOpen ? setIsOpen(false) : setIsOpen(true);
          }}
        >
          {isOpen ? (
            <>
              {status === "loading" ? (
                <div className="absolute right-1 top-1.5 z-20 h-5 w-8 transform text-text-primary opacity-100 transition-all duration-1000 ease-out">
                  <BeatLoader size={6} color="#602d0d" />
                </div>
              ) : (
                <AiOutlineClose
                  id="close-search"
                  onClick={() => {
                    setSearch("");
                    searchRef.current ? (searchRef.current.value = "") : null;
                    setIsSearching(false);
                    setSearchResults([]);
                    setIsOpen(false);
                  }}
                  className="absolute right-1 top-1.5 z-20 h-5 w-5 transform text-text-primary opacity-100 transition-all duration-1000 ease-out"
                />
              )}
            </>
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
