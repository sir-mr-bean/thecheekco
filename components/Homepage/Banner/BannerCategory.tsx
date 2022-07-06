import Image, { StaticImageData } from "next/image";
import { slugify } from "@/utils/hooks/useSlugify";
import Link from "next/link";

const BannerCategory = ({
  category,
  image,
}: {
  category: string;
  image: StaticImageData;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Link passHref href={`/shop/${slugify(category)}`}>
        <a className="text-text-primary">
          <div className="relative h-28 w-28 cursor-pointer overflow-hidden rounded-lg border border-text-secondary lg:h-52 lg:w-52">
            <Image
              src={image}
              alt={`Shop ${category}`}
              objectFit="cover"
              objectPosition={
                category === "Home" || category === "Accessories"
                  ? `25% 10%`
                  : `90% 60%`
              }
              layout="responsive"
              height={
                category === "Home" || category === "Accessories" ? 900 : 600
              }
              width={600}
              priority
              className="h-full w-full rounded-md"
            />
          </div>
        </a>
      </Link>
      <a
        href={`/shop/${slugify(category)}`}
        className="mt-2 w-full cursor-pointer rounded-xl border border-transparent bg-button px-1.5 py-1 text-center text-xs font-semibold uppercase text-white hover:border-white sm:px-4 sm:py-1.5 lg:text-sm"
      >
        {category}
      </a>
      {/* <span className="w-fit px-1 py-1 bg-button text-xs rounded-lg font-semibold text-white capitalize">
        {category}
      </span> */}
    </div>
  );
};

export default BannerCategory;
