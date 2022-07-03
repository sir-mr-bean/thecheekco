import Script from "next/script";

const events = () => {
  return (
    <>
      <div className="p-1 sm:p-20 text-text-primary rounded-xl ">
        <div
          className="rounded-xl"
          style={{
            width: "100%",
            textAlign: "left",
            color: "green",
            borderRadius: "12px",
          }}
        >
          <div id="simpletixEmbed" className="rounded-xl">
            <Script
              strategy="afterInteractive"
              src="https://embed.prod.simpletix.com/assets/widget/embediFrame.js"
              data-url="https://embed.prod.simpletix.com/6015e5ea-1af1-4beb-8242-5d75d54dc7f4/107357?smtxorigin=12"
            ></Script>
          </div>
          <div
            className="rounded-xl"
            style={{
              fontFamily: "Helvetica, Arial",
              fontSize: "12px",
              padding: "30px 0 5px",
              margin: "2px",
              width: "100%",
              textAlign: "left",
              color: "green",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default events;
