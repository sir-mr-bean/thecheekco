import Head from "next/head";
import Link from "next/link";

const ReturnsPolicy = () => {
  return (
    <>
      <Head>
        <title>The Cheek Co. - Returns and Exchange Policy</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-1 mt-16 rounded-md bg-white font-gothic text-text-primary shadow-sm shadow-black md:mx-16">
        <div className="mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          <div className="flex w-full flex-col space-y-5 px-2 font-gothic sm:px-10">
            <h1 className="w-full text-2xl sm:text-4xl">
              Returns & Exchange Policy
            </h1>
            <div className="border-b border-text-secondary"></div>
            <span className="pt-2 text-sm sm:text-base">
              Returns may be processed{" "}
              <span className="font-semibold">
                up to 30 days from your purchase date.{" "}
              </span>
              <span className="pb-2">
                With just a valid purchase date and customer details so that we
                may find the transaction in our system. As yes, we know - we
                dont really do hard-copy reciepts.
              </span>
            </span>
            <h1 className="text-lg sm:text-2xl">Change Of Mind:</h1>
            <p className="text-sm sm:text-base">
              At this stage we cannot offer returns due to change of mind.
              Unfortunately due to the nature of our eco initiatives, many items
              come with zero packaging. This means we cannot offer exchanges or
              returns for change of mind. (for hygiene reasons)
            </p>
            <h1 className="text-lg sm:text-2xl">Faulty Items:</h1>
            <p className="text-sm sm:text-base">
              If you believe your item is faulty please{" "}
              <Link passHref href="/contact-us">
                <a href="/contact-us" className="underline">
                  contact
                </a>
              </Link>{" "}
              the team or email us at customerservice@thecheekco.com so we may
              assist you in a return or replacement item.
            </p>
            <h1 className="text-lg sm:text-2xl">Online Purchases:</h1>
            <p className="text-sm sm:text-base">
              Return shipping charges are non-refundable. We are however happy
              to arrange shipping on your behalf and deduct shipping costs from
              the refundable amound.
            </p>
            <h1 className="text-lg sm:text-2xl">Return Shipping Address: </h1>
            <p className="text-sm sm:text-base">
              Please ensure you arrange a return with us before mailing any
              items back to ensure our team can efficiently process the return.
            </p>
            <h1 className="text-lg sm:text-2xl">Return Address:</h1>
            <div className="flex flex-col items-start justify-center">
              <span className="text-sm sm:text-base">
                Return Address: ATT: The Cheek Co Shop
              </span>
              <span>4 / 90 Lake St, Cairns,</span>
              <span>4870, QLD</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnsPolicy;
