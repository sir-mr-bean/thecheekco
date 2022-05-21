import "../styles/globals.css";
import App from "next/app";
import Header from "../components/Header/Header";
import axios from "axios";

function MyApp({ Component, pageProps, categories }) {
  return (
    <div className="max-w-screen min-h-[150vh] bg-bg-tan bg-cover ">
      <Header navigation={categories} />
      <Component {...pageProps} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { data } = await axios.get("http://localhost:1337/api/categories", {
    headers: {
      Accept: "application/json",
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
