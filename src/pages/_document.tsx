import { Html, Head, Main, NextScript } from "next/document";
import * as gtag from "lib/gtag";
import { NextStrictCSP } from "next-strict-csp";
import Script from "next/script";

const GTMJs = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gtag.GA_TRACKING_ID}', {
    page_path: window.location.pathname,
  });
`;

NextStrictCSP.inlineJs = [GTMJs];

const HeadCSP = process.env.NODE_ENV === "production" ? NextStrictCSP : Head;

export default function Document() {
  return (
    <Html>
      <HeadCSP>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" />
        )}
        {/* <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        /> */}
        {/* Google Tag Manager */}
        {/* {process.env.NODE_ENV === "production" && ( */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: GTMJs,
          }}
        />
        {/* )} */}
        {/* End Google Tag Manager */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Gothic+A1:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Beth+Ellen&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Arvo:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap"
          rel="stylesheet"
        />
      </HeadCSP>
      <body>
        {process.env.NODE_ENV === "production" && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src=https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
