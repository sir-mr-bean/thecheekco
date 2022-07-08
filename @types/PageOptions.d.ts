export type IntroOptions = {
  duration: "" | "monthly" | "threemonths";
};

export type PageOneOptions = {
  bathProducts: boolean;
  showerProducts: boolean;
  both: boolean;
};

export type PageTwoOptions = {
  shampooBar: boolean;
  conditioner: boolean;
  bodyWash: boolean;
  bodyButter: boolean;
  soapBar: boolean;
  bathSoak: boolean;
  bubbleBath: boolean;
  showerSteamer: boolean;
};

export type PageThreeOptions = {
  sweet: boolean;
  fruity: boolean;
  masculine: boolean;
  floral: boolean;
  fragranceFree: boolean;
  avoid: string;
  allergies: string;
};

export type PageFourOptions = {
  dry: boolean;
  oily: boolean;
  normal: boolean;
  mix: boolean;
};

export type PageFiveOptions = {
  hair: boolean;
  skin: boolean;
  sleep: boolean;
  home: boolean;
  wearable: boolean;
};
