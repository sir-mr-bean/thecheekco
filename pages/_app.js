import "../styles/globals.css";
import App from "next/app";
import Header from "../components/Header/Header";
import { getStrapiURL } from "../utils/api";
import Script from "next/script";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import Context from "../context/Context";

function MyApp({ Component, pageProps }) {
  return (
    <Context>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
    page_path: window.location.pathname,
    });
`}
      </Script>

      <div className="max-w-screen min-h-[150vh] bg-bg-tan bg-cover ">
        <Header />
        <Component {...pageProps} />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Context>
  );
}

// MyApp.getInitialProps = async (appContext) => {
//   const request = getStrapiURL("/api/categories");
//   console.log("Request is ", request);
//   console.log(serverRuntimeConfig);
//   const res = await fetch(request, {
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${serverRuntimeConfig.strapiSecret}`,
//     },
//   });
//   const { data } = await res.json();
//   console.log(data);
//   const appProps = await App.getInitialProps(appContext);

//   return {
//     categories: {
//       data,
//     },
//     ...appProps,
//   };
// };

export default MyApp;
