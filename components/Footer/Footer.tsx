import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className=" w-full h-[250px] sm:h-[400px] mt-20 ">
      <div className="flex flex-col w-full bg-footer-backdrop bg-cover bg-center h-full justify-between items-stretch bg-blend-lighten bg-white bg-opacity-20">
        <div className="lg:w-1/2 sm:w-2/3 items-center justify-center  text-text-primary space-y-3 font-gothic font-semibold text-center p-4 sm:pt-20 text-xs sm:text-sm lg:text-lg bg-bg-tan/80 sm:bg-transparent rounded-lg px-3 sm:mx-auto">
          <p>
            Clean, quality bath and body products shouldn't cost the earth or
            your back pocket. So we at The Cheek Co. have taken on the task. Our
            gorgeous range is clean, sustainable, eco conscious & handmade
            locally in Cairns QLD.
          </p>
          <p>
            We create it in small batches so you can consume it without waste.
          </p>
          <p>
            Finished your goodies? Not to worry, our packaging is always one of
            the following: compostable, reusable or recyclable.
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center text-white space-x-3 text-xs sm:text-lg px-4 pb-6">
            <Link href="/contact-us">
              <span className="cursor-pointer hover:scale-105">Contact</span>
            </Link>
            <Link href="/shipping-policy">
              <span className="cursor-pointer hover:scale-105">Shipping</span>
            </Link>
            <Link href="/contact-us">
              <span className="cursor-pointer hover:scale-105">Returns</span>
            </Link>
            <Link href="/privacy-policy">
              <span className="cursor-pointer hover:scale-105">
                Privacy Policy
              </span>
            </Link>
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
                <Image
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
