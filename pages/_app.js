import "../styles/globals.css";
import App from "next/app";
import Header from "../components/Header/Header";
import axios from "axios";
import { getStrapiURL } from "../utils/api";

function MyApp({ Component, pageProps, categories }) {
  return (
    <div className="max-w-screen min-h-[150vh] bg-bg-tan bg-cover ">
      <Header navigation={categories} />
      <Component {...pageProps} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const request = getStrapiURL("/api/categories");
  console.log(request);
  const { data } = await axios.get(request, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
    },
  });
  const appProps = await App.getInitialProps(appContext);

  return {
    categories: {
      data,
    },
    ...appProps,
  };
};

export default MyApp;
