import Head from "next/head";

const index = () => {
  return (
    <>
      <Head>
        <title>The Cheek Co. - Click & Collect</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-black font-gothic text-text-primary">
        <div className="mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          <div className="flex flex-col w-full font-gothic space-y-3 px-2 sm:px-10">
            <h1 className="text-2xl sm:text-4xl">Click and Collect</h1>
            <div className="flex flex-col items-start justify-center space-y-3">
              <span className="text-sm sm:text-base">
                Save time, enjoy super-fast collection for FREE from our store
                in Cairns when you pay online. Click and Collect gives you full
                peace of mind as to when you will receive your order, without
                having to worry about not being home and missing the delivery.
              </span>
              <span className="text-sm sm:text-base">
                We'll hold your items for 14 days and you can pick it up when
                convenient for you.
              </span>
              <span className="text-sm sm:text-base">
                We'll email you confirmation after your order is placed with
                your Click and Collect order number. When your order is
                available to collect, you will receive a Ready to Collect email,
                then pop into the store to grab your goodies. To use our Click
                and Collect service, simply select this option during the
                checkout at the delivery stage and select your desired store.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
