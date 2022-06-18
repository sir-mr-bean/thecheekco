// import globals.css
import "./globals.css";
import "@/styles/widget.min.css";
import Header from "@/components/Header/Header";
import * as gtag from "lib/gtag";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import CartContext, { WishListContext } from "@/context/Context";
import { useEffect } from "react";
import { withTRPC } from "@trpc/next";
import {
  getCsrfToken,
  getSession,
  SessionProvider,
  useSession,
} from "next-auth/react";
import { AppRouter } from "@/backend/router/_app";
import superjson from "superjson";
import Footer from "@/components/Footer/Footer";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { useRouter } from "next/router";
import Script from "next/script";
import { AppProps } from "next/app";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
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
    if (pageProps.session?.data?.user) {
      gtag.setUser({
        userId: pageProps.session.data.user.email,
      });
    }
  }, [pageProps.session]);

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
          <div className="max-w-screen bg-bg-tan bg-cover">
            <Header />
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
            <Footer />

            <Toaster position="top-right" reverseOrder={false} gutter={-40} />
          </div>
        </WishListContext>
      </CartContext>
    </SessionProvider>
  );
};

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}

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
  return {
    pageProps: {
      session: await getSession(ctx),
    },
  };
};
