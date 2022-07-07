import { slugify } from "@/utils/hooks/useSlugify";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { CatalogObject } from "square";

const HeaderBottom = () => {
  const categoryQuery = trpc.useQuery(["square-categories.all-categories"]);
  const { data: navigation } = categoryQuery;

  return (
    <div className="h-5 bg-header-brown bg-opacity-90 font-gothic text-[10px] text-header-text sm:h-auto">
      <ul className="hidden justify-center pl-3 sm:flex sm:space-x-6">
        {navigation &&
          navigation
            .sort((a: CatalogObject, b: CatalogObject) =>
              a.id > b.id ? 1 : -1
            )
            .filter(
              (item: CatalogObject) =>
                item?.categoryData?.name?.charAt(0) != "_"
            )
            .map((nav: CatalogObject, i: number) => {
              return (
                <Link
                  key={nav.id}
                  href="/shop/[id]/"
                  as={`/shop/${slugify(nav?.categoryData?.name as string)}`}
                >
                  <li
                    key={i}
                    className="h-full cursor-pointer px-1.5 py-1 hover:scale-125 hover:transform hover:transition-all"
                  >
                    <span className="font-gothic text-xs font-normal capitalize">
                      {nav.categoryData?.name}
                    </span>
                  </li>
                </Link>
              );
            })}
      </ul>
    </div>
  );
};

export default HeaderBottom;
