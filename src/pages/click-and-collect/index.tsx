import Head from "next/head";
import Image from "next/image";
import Shop from "../../../public/images/ClickAndCollect/shop.png";
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
      <div className="mx-1 mt-16 flex rounded-md bg-white font-gothic text-text-primary shadow-sm shadow-black md:mx-16">
        <div className="w-full px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-24 md:w-1/2 lg:px-8 xl:px-2 xl:pt-14">
          <div className="flex h-full w-full flex-col space-y-3 px-2 font-gothic sm:px-10">
            <h1 className="text-2xl sm:pt-14 sm:text-4xl">Click and Collect</h1>
            <div className="flex h-full w-full flex-col items-start justify-evenly space-y-8">
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
                checkout at the delivery stage.
              </span>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 py-96 md:block">
          <Image
            src={Shop}
            layout="fill"
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
            priority
            alt="Our cute store on Shields Street in Cairns"
          />
        </div>
      </div>
    </>
  );
};

export default index;
