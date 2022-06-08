// import globals.css
import "./globals.css";
import "@/styles/widget.min.css";
import Header from "@/components/Header/Header";
import Script from "next/script";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import CartContext, { WishListContext } from "@/context/Context";
import FirebaseAuthContext from "@/context/FirebaseAuthContext";
import type { AppProps } from "next/app";
import * as React from "react";
import UserContext from "@/context/User/userContext";
import { withTRPC } from "@trpc/next";

import { AppRouter } from "@/backend/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <FirebaseAuthContext>
      <UserContext>
        <CartContext>
          <WishListContext>
            <Head>
              <title>The Cheek Co. - Bath and Body </title>
              <meta
                name="description"
                content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script
              id="google-tags-script"
              strategy="afterInteractive"
              defer
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />
            <Script
              id="simple-tix-widget"
              src="https://embed.prod.simpletix.com/assets/widget/widget.min.js"
            ></Script>

            <div className="max-w-screen min-h-[150vh] bg-bg-tan bg-cover">
              <Header />
              <Component {...pageProps} />
              <Toaster position="top-right" reverseOrder={false} gutter={-40} />
            </div>
          </WishListContext>
        </CartContext>
      </UserContext>
    </FirebaseAuthContext>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
