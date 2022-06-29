import Script from "next/script";
import styles from "./IFrame.module.css";
import Head from "next/head";
import { useEffect, useState } from "react";

const IFrame = () => {
  const [iframe, setIframe] = useState(null);
  return (
    <>
      <Script
        id="will-fail"
        strategy="lazyOnload"
        src="https://embed.prod.simpletix.com/assets/widget/widget.min.js"
        charset="utf-8"
        onLoad={() => {
          console.log("loaded");
          setIframe(document.getElementById("smt_pinBoard"));
        }}
        onError={(e) => {
          console.error("Script failed to load", e);
        }}
      />
      <link
        href="https://embed.prod.simpletix.com/assets/widget/widget.min.css"
        rel="stylesheet"
      />
      {/*
      <script src="https://embed.prod.simpletix.com/assets/widget/widget.min.js"></script>
      {/* <iframe
        src="https://embed.prod.simpletix.com/assets/widget/widget.min.js"
        width="100%"
      ></iframe> */}
      <div className="smt-pin-board h-screen" id="smt_pinBoard">
        <input
          type="hidden"
          value="6015e5ea-1af1-4beb-8242-5d75d54dc7f4"
          id="smt_hdnApplicationId"
        />
        <input type="hidden" value="the cheek co." id="smt_hdnStoreName" />
        <input type="hidden" value="Next50" id="smt_displayStyle" />
      </div>
    </>
  );
};

export default IFrame;
