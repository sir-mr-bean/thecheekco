import {
  PageFiveOptions,
  PageFourOptions,
  PageOneOptions,
  PageThreeOptions,
  PageTwoOptions,
} from "@/types/PageOptions";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import NoThanks from "./FinalPage/NoThanks";
import YesPlease from "./FinalPage/YesPlease";

const FinalPage = ({
  pageOneOptions,
  pageTwoOptions,
  pageThreeOptions,
  pageFourOptions,
  pageFiveOptions,
  gift,
}: {
  pageOneOptions: PageOneOptions;
  pageTwoOptions: PageTwoOptions;
  pageThreeOptions: PageThreeOptions;
  pageFourOptions: PageFourOptions;
  pageFiveOptions: PageFiveOptions;
  gift: boolean;
}) => {
  return (
    <div className="w-full justify-center">
      <div className="mx-4 rounded-lg bg-bg-tan p-2">
        <h1 className="text-2xl pb-6">Review your Cheeky Box:</h1>
        <div className="flex flex-wrap items-start justify-around w-full">
          <span className="text-sm sm:text-lg text-center border rounded-lg p-2 border-text-secondary">
            {pageOneOptions.bathProducts
              ? "Just Bath Products"
              : pageOneOptions.showerProducts
              ? "Just Shower Products"
              : "Both Shower and Bath Products"}
          </span>
          <div className="text-sm sm:text-lg text-start flex flex-col items-start justify-center border rounded-lg p-2 border-text-secondary">
            <ul>
              <li>
                {pageTwoOptions.bathSoak ? (
                  <YesPlease item="Bath Soaks" />
                ) : (
                  <NoThanks item="Bath Soaks" />
                )}
              </li>
              <li>
                {pageTwoOptions.bodyButter ? (
                  <YesPlease item="Body Butter" />
                ) : (
                  <NoThanks item="Body Butter" />
                )}
              </li>
              <li>
                {pageTwoOptions.bodyWash ? (
                  <YesPlease item="Body Wash" />
                ) : (
                  <NoThanks item="Body Wash" />
                )}
              </li>
              <li>
                {pageTwoOptions.bubbleBath ? (
                  <YesPlease item="Bubble Bath" />
                ) : (
                  <NoThanks item="Bubble Bath" />
                )}
              </li>
              <li>
                {pageTwoOptions.conditioner ? (
                  <YesPlease item="Conditioner" />
                ) : (
                  <NoThanks item="Conditioner" />
                )}
              </li>
              <li>
                {pageTwoOptions.shampooBar ? (
                  <YesPlease item="Shampoo Bar" />
                ) : (
                  <NoThanks item="Shampoo Bar" />
                )}
              </li>
              <li>
                {pageTwoOptions.showerSteamer ? (
                  <YesPlease item="Shower Steamer" />
                ) : (
                  <NoThanks item="Shower Steamer" />
                )}
              </li>
              <li>
                {pageTwoOptions.soapBar ? (
                  <YesPlease item="Soap Bar" />
                ) : (
                  <NoThanks item="Soap Bar" />
                )}
              </li>
            </ul>
          </div>
          <div className="text-sm sm:text-lg text-start flex flex-col items-start justify-center border rounded-lg p-2 border-text-secondary">
            <ul>
              <li>
                {pageThreeOptions.sweet ? (
                  <YesPlease item="Sweet" />
                ) : (
                  <NoThanks item="Sweet" />
                )}
              </li>
              <li>
                {pageThreeOptions.fruity ? (
                  <YesPlease item="Fruity" />
                ) : (
                  <NoThanks item="Fruity" />
                )}
              </li>
              <li>
                {pageThreeOptions.floral ? (
                  <YesPlease item="Floral" />
                ) : (
                  <NoThanks item="Floral" />
                )}
              </li>
              <li>
                {pageThreeOptions.fragranceFree ? (
                  <YesPlease item="Fragrance Free" />
                ) : (
                  <NoThanks item="Fragrance Free" />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPage;
