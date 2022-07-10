export type IntroOptions = {
  duration: "" | "monthly" | "threemonths";
};

export type PageOneOptions = {
  bath: boolean;
  shower: boolean;
  both: boolean;
};

export type PageTwoOptions = {
  shampooBar: boolean;
  conditioner: boolean;
  bodyWash: boolean;
  bodyButter: boolean;
  soapBar: boolean;
  bathSoak: boolean;
  beautyTools: boolean;
  hygieneAccessories: boolean;
};

export type PageThreeOptions = {
  floral: boolean;
  allNatural: boolean;
  darkAndSexy: boolean;
  fruity: boolean;
  sweet: boolean;
  fragranceFree: boolean;
  allergies: string;
};

export type PageFourOptions = {
  dry: boolean;
  oily: boolean;
  combination: boolean;
  mild: boolean;
  medium: boolean;
  high: boolean;
};

export type PageFiveOptions = {
  hair: boolean;
  skin: boolean;
  sleep: boolean;
  bathroomAccessories: boolean;
  homeDecor: boolean;
  wearable: boolean;
};
