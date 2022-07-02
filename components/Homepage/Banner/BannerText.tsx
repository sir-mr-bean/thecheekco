const BannerText = () => {
  return (
    <div className="flex flex-col items-center  text-center justify-center w-full font-gothic pt-6 px-10">
      <span className="text-text-primary text-5xl sm:text-7xl lg:text-9xl font-light pb-3">
        the cheek co.
      </span>
      <span className="text-text-secondary text-xl sm:text-3xl lg:text-5xl pb-6">
        bath & body boutique
      </span>
      <span className="text-text-secondary text-sm sm:text-lg pb-3">
        Clean, quality bath and body products shouldn't cost the earth or your
        back pocket. So we at the cheek co. have taken on the task. Our gorgeous
        range is clean, sustainable, eco conscious & handmade locally.
      </span>
      <span className="text-text-secondary text-sm sm:text-lg">
        We create it in small batches so you can consume, without waste.{" "}
      </span>
    </div>
  );
};

export default BannerText;
