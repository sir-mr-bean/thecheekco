import Image from "next/image";
import accessories from "../../public/images/Homepage/accessories.png";
import bath from "../../public/images/Homepage/bath.png";
import gift_sets from "../../public/images/Homepage/gift_sets.png";
import home_decor from "../../public/images/Homepage/home_decor.png";
import shower from "../../public/images/Homepage/shower.png";
import skin_care from "../../public/images/Homepage/skin_care.png";
import bumlogo from "../../public/images/Homepage/bumlogo.png";

const OldBanner = () => {
  return (
    <div className="relative z-0 pt-4 font-gothic font-normal text-white sm:mx-32 xl:mx-72 ">
      <div className="flex flex-col mx-4 h-fit space-y-2 sm:space-y-6 w-fit">
        <div className="flex items-start justify-center w-full space-x-2 sm:space-x-6">
          <div className="flex flex-col items-center justify-start w-full space-y-2 sm:space-y-6 ">
            <div className="bg-button rounded-lg flex flex-col items-center justify-center p-2 sm:py-6 lg:py-1.5 w-fit shadow-slate-500 shadow-sm">
              <div className="flex flex-row items-center justify-center h-14 sm:h-16 py-1">
                <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl text-center h-fit">
                  More
                </span>
                <div className="block w-16 sm:w-24 lg:w-32">
                  <Image
                    src={bumlogo}
                    width={75}
                    height={75}
                    layout="responsive"
                    priority
                  />
                </div>
                <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl text-left h-fit whitespace-nowrap">
                  than
                </span>
              </div>
              <span className="text-2xl font-extralight sm:text-3xl lg:text-6xl h-fit text-center xl:px-48">
                your bathroom can handle!
              </span>
              <span className="text-base lg:text-2xl text-center font-thin pt-1 sm:pt-6 px-0 sm:px-16 xl:px-12">
                Handmade in our shop in Cairns, all our bath & body products are
                created by us and tested on us.
              </span>
            </div>

            <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg w-full h-40 lg:h-64 relative">
              <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                <div className="py-1 bg-button border border-transparent rounded-md whitespace-nowrap shadow-sm shadow-text-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 px-2 sm:px-4">
                      <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white uppercase">
                        Skin Care
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src={skin_care}
                alt="Shop Skin Care"
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                className="rounded-md"
                priority
              />
            </div>
            <div className="w-full flex items-center justify-center h-full">
              <div className="w-full border border-text-primary rounded-lg h-32 lg:h-72 mr-2 sm:mr-6 relative">
                <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                  <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 px-2 sm:px-4">
                        <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                          Accessories
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <Image
                  src={accessories}
                  alt="Accessories"
                  objectFit="cover"
                  objectPosition="center"
                  layout="fill"
                  className="rounded-md"
                  priority
                />
              </div>
              <div className="w-full border border-text-primary rounded-lg h-32 lg:h-72 relative">
                <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                  <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 px-2 sm:px-4">
                        <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                          Gift Sets
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <Image
                  src={gift_sets}
                  alt="Shop Gift Sets"
                  objectFit="cover"
                  objectPosition="center"
                  layout="fill"
                  className="rounded-md"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="w-1/3 space-y-2 sm:space-y-6 box-content">
            <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg lg:min-w-[250px] h-[260px] sm:h-80 lg:h-[450px] relative box-content">
              <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 px-2 sm:px-4">
                      <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                        Bath
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src={bath}
                alt="Shop Bath"
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                className="rounded-md"
                priority
              />
            </div>
            <div className="flex flex-col justify-center items-center border border-text-primary rounded-lg lg:min-w-[250px] h-[265px] sm:h-80 lg:h-[400px] relative box-content">
              <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
                <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 px-2 sm:px-4">
                      <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                        Shower
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src={shower}
                alt="Shop Shower"
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                className="rounded-md h-full w-full"
                priority
              />
            </div>
          </div>
        </div>
        <div className="w-full border-text-primary border rounded-lg h-36 sm:h-48 lg:h-72 relative">
          <div className="absolute w-full sm:w-1/3 sm:inset-x-1/3 bottom-2 z-10 flex flex-col justify-center items-center">
            <div className="py-1 bg-button shadow-text-primary border border-transparent rounded-md whitespace-nowrap shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 px-2 sm:px-4">
                  <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white">
                    Home Decor
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={home_decor}
            alt="Shop Home Decor"
            objectFit="cover"
            objectPosition="center"
            layout="fill"
            className="rounded-md "
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default OldBanner;
