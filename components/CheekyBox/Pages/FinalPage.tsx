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
        <h1 className="pb-6 text-2xl">Review your Cheeky Box:</h1>
        <div className="flex w-full flex-wrap items-start justify-around">
          <span className="rounded-lg border border-text-secondary p-2 text-center text-sm sm:text-lg">
            {pageOneOptions.bath
              ? "Just Bath Products"
              : pageOneOptions.shower
              ? "Just Shower Products"
              : "Both Shower and Bath Products"}
          </span>
          <div className="flex flex-col items-start justify-center rounded-lg border border-text-secondary p-2 text-start text-sm sm:text-lg">
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
          <div className="flex flex-col items-start justify-center rounded-lg border border-text-secondary p-2 text-start text-sm sm:text-lg">
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
