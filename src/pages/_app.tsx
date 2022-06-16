// import globals.css
import "./globals.css";
import "@/styles/widget.min.css";
import Header from "@/components/Header/Header";
import Script from "next/script";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import CartContext, { WishListContext } from "@/context/Context";
import type { AppProps } from "next/app";
import * as React from "react";
import { withTRPC } from "@trpc/next";
import { getCsrfToken, getSession, SessionProvider } from "next-auth/react";
import { AppRouter } from "@/backend/router/_app";
import superjson from "superjson";
import Footer from "@/components/Footer/Footer";
import { trpc } from "@/utils/trpc";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";

const MyApp = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
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

          <div className="max-w-screen bg-bg-tan bg-cover">
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
  ssr: true,
})(MyApp);

MyApp.getInitialProps = async ({ ctx }) => {
  const session = await getSession(ctx);
  const csrfToken = await getCsrfToken(ctx);

  if (!session) {
    return {
      session: null,

      csrfToken: null,
    };
  }

  return {
    pageProps: {
      session: session,
      csrfToken: csrfToken,
    },
  };
};
