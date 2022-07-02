import BannerText from "./BannerText";
import BannerCategories from "./BannerCategories";

const Banner = () => {
  return (
    <>
      <div className="w-full bg-bum-banner bg-cover z-100">
        <BannerText />
        <BannerCategories />
      </div>
    </>
  );
};

export default Banner;
