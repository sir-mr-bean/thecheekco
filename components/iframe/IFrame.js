import Script from "next/script";
import styles from "./IFrame.module.css";
import Head from "next/head";

const IFrame = () => {
  return (
    <>
      <link
        href="https://embed.prod.simpletix.com/assets/widget/widget.min.css"
        rel="stylesheet"
      />
      <script src="https://embed.prod.simpletix.com/assets/widget/widget.min.js"></script>
      <div class="smt-pin-board" id="smt_pinBoard">
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
