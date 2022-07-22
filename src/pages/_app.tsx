// import globals.css
import "./globals.css";
import Header from "@/components/Header/Header";
import * as gtag from "lib/gtag";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import CartContext from "@/context/Cart/Context";
import WishListContext from "@/context/Wishlist/Context";
import { useEffect } from "react";
import { withTRPC } from "@trpc/next";
import { getSession, SessionProvider, useSession } from "next-auth/react";
import { AppRouter } from "@/backend/router/_app";
import superjson from "superjson";
import Footer from "@/components/Footer/Footer";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { useRouter } from "next/router";
import Script from "next/script";
import React from "react";
import { AppProps, NextWebVitalsMetric } from "next/app";
import { NextPageContext } from "next";
import "@fontsource/gothic-a1";
import { NextResponse } from "next/server";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const { id, name, label, value } = metric;
  // Use `window.gtag` if you initialized Google Analytics as this example:
  // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
  if (process.env.NODE_ENV === "production") {
    window.gtag("event", name, {
      event_category:
        label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
      value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
      event_label: id, // id unique to current page load
      non_interaction: true, // avoids affecting bounce rate.
    });
  }
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  useEffect(() => {
    if (session?.user) {
      gtag.setUser({
        userId: session?.user.email,
      });
    }
  }, [pageProps.session]);

  return (
    <SessionProvider session={session}>
      <CartContext>
        <WishListContext>
          <Head>
            <title>The Cheek Co. - Handmade Bath and Body</title>
            <meta
              name="description"
              content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
            <meta property="og:image" content="/images/logo.png" />
          </Head>
          <div className="max-w-screen z-50 bg-bg-tan bg-cover">
            <Header />
            <Component {...pageProps} />
            <Footer />
            <Toaster position="top-right" reverseOrder={false} gutter={-40} />
          </div>
        </WishListContext>
      </CartContext>
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";
    const ONE_HOUR_IN_SECONDS = 60 * 60;
    return {
      url,
      transformer: superjson,
      links: [
        splitLink({
          condition(op) {
            // check for context property `skipBatch`
            return op.context.skipBatch === true;
          },
          // when condition is true, use normal request
          true: httpLink({
            url,
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url,
          }),
        }),
      ],

      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: { queries: { staleTime: ONE_HOUR_IN_SECONDS } },
      },
    };
  },

  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);

MyApp.getInitialProps = async ({
  ctx,
  res,
}: {
  ctx: NextPageContext;
  res: NextResponse;
}) => {
  const session = await getSession(ctx);
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=30, stale-while-revalidate=600"
  );

  if (session) {
    return {
      pageProps: {
        session: await getSession(ctx),
      },
    };
  } else {
    return {
      pageProps: {
        session: null,
      },
    };
  }
};
