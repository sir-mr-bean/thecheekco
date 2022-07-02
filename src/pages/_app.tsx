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
import FooterNoText from "@/components/Footer/FooterNoText";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { useRouter } from "next/router";
import Script from "next/script";
import React from "react";
import { AppProps } from "next/app";
import { NextPageContext } from "next";
import "@fontsource/gothic-a1";
import { NextResponse } from "next/server";

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
  console.log(router);

  return (
    <SessionProvider session={session}>
      <CartContext>
        <WishListContext>
          <Head>
            <title>The Cheek Co. - Homemade Bath and Body</title>
            <meta
              name="description"
              content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <div className="max-w-screen bg-bg-tan bg-cover z-50">
            <Header />
            <Component {...pageProps} />
            {router.pathname === "/" ? <Footer /> : <FooterNoText />}
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
