import CheekyBoxWrapper from "@/components/CheekyBox/CheekyBoxWrapper";
import Head from "next/head";

const index = () => {
  return (
    <>
      <Head>
        <title>The Cheek Co. - Cheeky Box</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CheekyBoxWrapper />
    </>
  );
};

export default index;
