import Image from "next/image";
import { BsEmojiHeartEyesFill, BsHeartFill } from "react-icons/bs";
import { FaKissWinkHeart } from "react-icons/fa";
import maddiAvatar from "../../public/images/Homepage/maddiavatar.png";

const HowItBegan = () => {
  return (
    <section
      aria-labelledby="social-impact-heading"
      className="mt-16 sm:mt-24 bg-paper-bg bg-cover bg-center w-full"
    >
      <div className="bg-button shadow-text-primary bg-opacity-30 py-16 sm:py-20 flex items-center justify-center w-full sm:px-32">
        <div className="relative sm:w-96 sm:h-96 sm:pt-10">
          <Image
            src={maddiAvatar}
            height={144}
            width={144}
            layout="responsive"
          />
        </div>
        <div className="flex flex-col p-5 sm:p-0">
          <h2
            id="social-impact-heading"
            className="font-extrabold tracking-tight text-text-secondary max-w-xl font-gothic text-center sm:text-left mx-1"
          >
            <span className="text-4xl lg:text-6xl font-semibold">
              How it all began...
            </span>
          </h2>
          <div className="text-text-secondary text-lg py-4 flex flex-col items-start justify-start text-left space-y-4">
            <p>
              It began with an itch, an eczema itch! Suffering from eczema Maddi
              struggled to find natural, local products that weren't wrapped in
              plastic or over packaged.
            </p>
            <p>
              Maddi began The Cheek Co by developing bath and skin care products
              specifically for her family's needs. Ensuring they would be
              natural & nourishing from cheek to cheek.
            </p>
            <p>
              Keep up with Maddi behind the scenes as she whips up fresh goodies
              daily.
            </p>
            <div className="mt-2">
              <a
                href="https://www.instagram.com/thecheekco/"
                target="_blank"
                className="relative flex w-fit mx-auto bg-button rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
              >
                FOLLOW MADDI’S SHENANIGANS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItBegan;
