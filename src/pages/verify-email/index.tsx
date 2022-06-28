import Link from "next/link";

const ShippingPolicy = () => {
  return (
    <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-black font-gothic text-text-primary">
      <div className="mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <div className="flex flex-col w-full font-gothic space-y-3 px-2 sm:px-10 text-sm sm:text-base">
          <h1 className="text-2xl sm:text-4xl py-4">Magic Link Sent!</h1>
          <p>
            Check your email account for a sign in link. This email will come
            from donotreply@thecheekco.com.
          </p>
          <p>
            Please check your junk mail if you do not see the email arrive
            within the next few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
