import BannerText from "./BannerText";
import BannerCategories from "./BannerCategories";
import Events from "../Events";

const Banner = () => {
  return (
    <>
      <div className="w-full bg-bum-banner bg-repeat-space bg-cover z-100">
        <Events />
        <BannerText />
        <BannerCategories />
      </div>
    </>
  );
};

export default Banner;
