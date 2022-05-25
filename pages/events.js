import Script from "next/script";

const events = () => {
  return (
    <>
      <Script src="https://embed.prod.simpletix.com/assets/widget/widget.min.js" />
      <iframe>
        <div className="smt-pin-board" id="smt_pinBoard">
          <input
            type="hidden"
            value="6015e5ea-1af1-4beb-8242-5d75d54dc7f4"
            id="smt_hdnApplicationId"
          />
          <input type="hidden" value="the cheek co." id="smt_hdnStoreName" />
          <input type="hidden" value="Next50" id="smt_displayStyle" />
        </div>
      </iframe>
    </>
  );
};

export default events;
