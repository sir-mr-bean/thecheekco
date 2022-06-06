import "../styles/globals.css";
import "../styles/widget.min.css";
import Header from "../components/Header/Header";
import Script from "next/script";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import CartContext, { WishListContext } from "../context/Context";
import { useState, useEffect } from "react";
import FirebaseAuthContext from "../context/FirebaseAuthContext";
import type { AppProps } from "next/app";
import * as React from "react";
import UserContext from "../context/User/userContext";

function MyApp({ Component, pageProps }: AppProps) {
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
              strategy="afterInteractive"
              defer
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy="afterInteractive" defer>
              {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
    page_path: window.location.pathname,
    });
`}
            </Script>
            <Script src="https://embed.prod.simpletix.com/assets/widget/widget.min.js"></Script>

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
}

export default MyApp;
