const BannerCategories = () => {
  return (
    <div className="w-2/3 flex flex-col flex-wrap text-text-primary items-center justify-center mx-auto pt-8 sm:pt-16 font-gothic">
      <span className="w-full flex items-center justify-center -translate-x-16 sm:-translate-x-48 my-4 font-semibold">
        shop by category
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 max-w-3xl place-items-center justify-items-center pb-10">
        <div className="w-24 h-24 lg:w-32 lg:h-32 border rounded-xl border-text-secondary ">
          Bath
        </div>
        <div className="w-24 h-24 lg:w-32 lg:h-32 border rounded-xl border-text-secondary ">
          Home
        </div>
        <div className="w-24 h-24 lg:w-32 lg:h-32 border rounded-xl border-text-secondary ">
          Gift Sets
        </div>
        <div className="w-24 h-24 lg:w-32 lg:h-32 border rounded-xl border-text-secondary ">
          Accessories
        </div>
        <div className="w-24 h-24 lg:w-32 lg:h-32 border rounded-xl border-text-secondary ">
          Shower
        </div>
        <div className="w-24 h-24 lg:w-32 lg:h-32 border rounded-xl border-text-secondary ">
          Skin Care
        </div>
      </div>
    </div>
  );
};

export default BannerCategories;
