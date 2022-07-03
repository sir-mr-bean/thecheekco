import Image, { StaticImageData } from "next/image";

const BannerCategory = ({
  category,
  image,
}: {
  category: string;
  image: StaticImageData;
}) => {
  return (
    <div className="relative w-28 h-28 lg:w-48 lg:h-48 border rounded-lg border-text-secondary hover:scale-[102%] cursor-pointer">
      <Image
        src={image}
        alt={`Shop ${category}`}
        objectFit="cover"
        objectPosition="center"
        layout="responsive"
        height={200}
        width={200}
        priority
        className="w-full h-full rounded-md"
      />
      <span className="hidden lg:block lg:absolute lg:inset-x-0 lg:bottom-1 lg:left-0.5 lg:w-fit px-1 py-1 lg:bg-button lg:text-sm rounded-lg font-semibold text-white capitalize">
        Shop {category}
      </span>
      <span className="absolute lg:hidden inset-x-0 bottom-1 left-1 w-fit px-1 py-1 bg-button text-xs rounded-lg font-semibold text-white capitalize">
        {category}
      </span>
    </div>
  );
};

export default BannerCategory;
