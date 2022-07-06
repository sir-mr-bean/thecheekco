const BannerText = () => {
  return (
    <div className="flex w-full flex-col  items-center justify-center px-10 pt-6 text-center font-gothic">
      <span className="pb-3 text-5xl font-light text-text-primary sm:text-7xl lg:text-9xl">
        the cheek co.
      </span>
      <span className="pb-6 text-xl text-text-secondary sm:text-3xl lg:text-5xl">
        bath & body boutique
      </span>
      <div className="flex flex-col space-y-3 lg:w-1/2">
        <span className="pb-3 text-sm text-text-secondary sm:text-lg">
          Clean, quality bath and body products shouldn't cost the earth or your
          back pocket. So we at the cheek co. have taken on the task. Our
          gorgeous range is clean, sustainable, eco conscious & handmade
          locally.
        </span>
        <span className="text-sm text-text-secondary sm:text-lg">
          We create all our products in small batches so you recieve the
          freshest quality product without waste.
        </span>
      </div>
    </div>
  );
};

export default BannerText;
