import Image from "next/image";
import accessories from "../../../public/images/Homepage/accessories.png";
import bath from "../../../public/images/Homepage/bath.png";
import gift_sets from "../../../public/images/Homepage/gift_sets.png";
import home_decor from "../../../public/images/Homepage/home_decor.png";
import shower from "../../../public/images/Homepage/shower.png";
import skin_care from "../../../public/images/Homepage/skin_care.png";
import BannerCategory from "./BannerCategory";

const BannerCategories = () => {
  return (
    <div className="flex flex-col flex-wrap text-text-primary items-center justify-center mx-auto pt-8 sm:pt-16 font-gothic">
      <span className="w-4/5 sm:w-1/2 mx-auto flex items-center justify-start my-4 font-semibold">
        shop by category
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl place-items-center justify-items-center content-center pb-10">
        <BannerCategory image={bath} category="Bath" />
        <BannerCategory image={home_decor} category="Home" />
        <BannerCategory image={gift_sets} category="Gift Sets" />
        <BannerCategory image={accessories} category="Accessories" />
        <BannerCategory image={shower} category="Shower" />
        <BannerCategory image={skin_care} category="Skin Care" />
      </div>
    </div>
  );
};

export default BannerCategories;
