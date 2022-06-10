import Image from "next/image";

const Footer = () => {
  return (
    <div className=" w-full h-[250px] sm:h-[400px] ">
      <div className="flex flex-col w-full bg-footer-backdrop bg-cover bg-center h-full justify-end items-stretch bg-blend-lighten bg-white bg-opacity-20">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center text-white space-x-3 text-xs sm:text-lg px-4 pb-6">
            <span>Contact</span>
            <span>Shipping</span>
            <span>Returns</span>
            <span>Privacy Policy</span>
          </div>
          <div className="flex  space-x-3 p-3 items-center justify-center">
            <div className="w-7 h-7 sm:w-20 sm:h-20">
              <Image
                alt="Eco Alliance Badge 1"
                src="/images/sticker2.png"
                height="300"
                width="300"
              />
            </div>
            <div className="w-7 h-7 sm:w-20 sm:h-20">
              <Image
                alt="Eco Alliance Badge 1"
                src="/images/sticker1.png"
                height="300"
                width="300"
              />
            </div>
            <div className="w-7 h-7 sm:w-20 sm:h-20">
              <a
                href="https://noissue.co/community/eco-alliance/"
                target="_blank"
                rel="noopener"
              >
                <img
                  alt="Eco Alliance Badge"
                  src="https://images.ctfassets.net/xmruv773lc7r/7iHSIdcOgBqG8KsVcw9wmm/46902df9b1125bfede12980be687dd7a/Eco-A.gif"
                  height="300"
                  width="300"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
