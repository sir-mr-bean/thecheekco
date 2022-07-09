import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="max-w-screen mt-20 h-[250px] overflow-hidden sm:h-[200px]">
      <div className="flex h-full w-full flex-col items-stretch justify-end bg-white bg-opacity-20 bg-footer-backdrop bg-cover bg-center bg-blend-lighten">
        <div className="flex items-end justify-between">
          <div className="flex items-center justify-center space-x-3 whitespace-nowrap px-4 pb-6 text-xs text-white sm:text-lg">
            <Link href="/contact-us">
              <span className="cursor-pointer hover:scale-105">Contact</span>
            </Link>
            <Link href="/shipping-policy">
              <span className="cursor-pointer hover:scale-105">Shipping</span>
            </Link>
            <Link href="/returns-policy">
              <span className="cursor-pointer hover:scale-105">Returns</span>
            </Link>
            <Link href="/privacy-policy">
              <span className="cursor-pointer hover:scale-105">
                Privacy Policy
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-1 p-3 sm:space-x-3">
            <div className="h-6 w-6 sm:h-20 sm:w-20">
              <div className="relative w-full">
                <Image
                  alt="Eco Alliance Badge 1"
                  src="/images/sticker2.png"
                  height="300"
                  width="300"
                />
              </div>
            </div>
            <div className="h-6 w-6 sm:h-20 sm:w-20">
              <div className="relative w-full">
                <Image
                  alt="Eco Alliance Badge 1"
                  src="/images/sticker1.png"
                  height="300"
                  width="300"
                />
              </div>
            </div>
            <div className="h-6 w-6 sm:h-20 sm:w-20">
              <a
                href="https://noissue.co/community/eco-alliance/"
                target="_blank"
                rel="noopener"
              >
                <div className="relative w-full">
                  <Image
                    alt="Eco Alliance Badge"
                    src="https://images.ctfassets.net/xmruv773lc7r/7iHSIdcOgBqG8KsVcw9wmm/46902df9b1125bfede12980be687dd7a/Eco-A.gif"
                    height="300"
                    width="300"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
