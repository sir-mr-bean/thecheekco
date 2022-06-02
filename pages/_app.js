import "../styles/globals.css";
import "../styles/widget.min.css";
import Header from "../components/Header/Header";
import Script from "next/script";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import CartContext, { WishListContext } from "../context/Context";
import { useState, useEffect } from "react";
import { PaymentForm } from "react-square-web-payments-sdk";
import FirebaseAuthContext from "../context/FirebaseAuthContext";

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    // function to run on scroll
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    };
  }, [scrollDirection]); // run when scroll direction changes

  return scrollDirection;
}

function MyApp({ Component, pageProps }) {
  const [total, setTotal] = useState(0);
  const scrollDirection = useScrollDirection();

  return (
    <FirebaseAuthContext>
      <CartContext>
        <WishListContext>
          <PaymentForm
            applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID}
            locationId="LNW290H2QTZVK"
            cardTokenizeResponseReceived={async (token, buyer) => {
              const cart = dynamic(() => import("../context/Context"));
              const response = await fetch("/api/pay", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  sourceId: token.token,
                  amount: total.toFixed(2).toString().replace(".", ""),
                }),
              });
              alert(JSON.stringify(await response.json(), null, 2));
            }}
          >
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
              <Header scrollDirection={scrollDirection} />
              <Component {...pageProps} />
              <Toaster position="top-right" reverseOrder={false} gutter={-40} />
            </div>
          </PaymentForm>
        </WishListContext>
      </CartContext>
    </FirebaseAuthContext>
  );
}

export default MyApp;
