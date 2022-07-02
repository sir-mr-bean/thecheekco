import BannerText from "./BannerText";
import BannerCategories from "./BannerCategories";
import Events from "../Events";

const Banner = () => {
  return (
    <>
      <div className="w-full bg-bum-banner bg-top bg-cover z-100 pb-10">
        <Events />
        <BannerText />
        <BannerCategories />
      </div>
    </>
  );
};

export default Banner;
