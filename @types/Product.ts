export interface Product {
  id: string;
  name: string;
  description?: string;
  variations: Variation[];
  image?: string;
  category?: Category;
  quantity: number | 0;
  isAllNatural?: boolean;
}

export interface Category {
  type: CategoryType;
  id: ID;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  catalog_v1_ids: CatalogV1ID[];
  present_at_all_locations: boolean;
  category_data: CategoryData;
}

export interface CatalogV1ID {
  catalog_v1_id: string;
  location_id: LocationID;
}

export enum LocationID {
  Lqt836Q24Ed81 = "LQT836Q24ED81",
}

export interface CategoryData {
  name: CategoryDataName;
  ordinal: number;
}

export enum CategoryDataName {
  Accessories = "Accessories",
  Bath = "Bath",
  EventHire = "_Event Hire",
  GiftSets = "Gift sets",
  Home = "Home",
  Shower = "Shower",
  SkinCare = "Skin Care",
}

export enum ID {
  Grffa7Up4Ey3Xpce7Yb6Vi7P = "GRFFA7UP4EY3XPCE7YB6VI7P",
  N7Zn7Frwhockgshe6Kkvaki5 = "N7ZN7FRWHOCKGSHE6KKVAKI5",
  R4Oe3Tq3Rza2Nlfyqtjtuk5Q = "R4OE3TQ3RZA2NLFYQTJTUK5Q",
  Rjcunvvmytekbg7Blogrvwt7 = "RJCUNVVMYTEKBG7BLOGRVWT7",
  Rns7M45Hnvgus5Tnhqom6PLD = "RNS7M45HNVGUS5TNHQOM6PLD",
  The2Jzew4Obfebmmbms5Yydgoww = "2JZEW4OBFEBMMBMS5YYDGOWW",
  The5Uil4Bda3Yyn6Uoz56Cn7H5D = "5UIL4BDA3YYN6UOZ56CN7H5D",
}

export enum CategoryType {
  Category = "CATEGORY",
}

export interface Variation {
  type: VariationType;
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  custom_attribute_values?: { [key: string]: CustomAttributeValue };
  present_at_all_locations: boolean;
  present_at_location_ids?: LocationID[];
  item_variation_data: ItemVariationData;
  catalog_v1_ids?: CatalogV1ID[];
}

export interface CustomAttributeValue {
  name: CustomAttributeValueName;
  string_value?: string;
  custom_attribute_definition_id: CustomAttributeDefinitionID;
  type: CustomAttributeValueType;
  key: Key;
  number_value?: string;
  boolean_value?: boolean;
  selection_uid_values?: string[];
}

export enum CustomAttributeDefinitionID {
  Gralwp6Kca7M6Li3Weweyvay = "GRALWP6KCA7M6LI3WEWEYVAY",
  Iley2Esftxwzqtuayimwruae = "ILEY2ESFTXWZQTUAYIMWRUAE",
  The4Wciicz4J7Ce75Peofzdgzmn = "4WCIICZ4J7CE75PEOFZDGZMN",
  Vatb6Hsdhjcph6Hrr7Dvyexf = "VATB6HSDHJCPH6HRR7DVYEXF",
  Zyp7Gzg6R4Ewbschnmuurqan = "ZYP7GZG6R4EWBSCHNMUURQAN",
}

export enum Key {
  Square3B3F304F3773471AA12D48E58776375B = "Square:3b3f304f-3773-471a-a12d-48e58776375b",
  Square3Ba5A5E4F9C646DcAbb9D799Ca83D91E = "Square:3ba5a5e4-f9c6-46dc-abb9-d799ca83d91e",
  Square526C200EB1DB42008421C345272257D6 = "Square:526c200e-b1db-4200-8421-c345272257d6",
  SquareA10899287880407E93F308Dfe506Ac14 = "Square:a1089928-7880-407e-93f3-08dfe506ac14",
  SquareC373Acb7E030422ABbccAae6E4F11958 = "Square:c373acb7-e030-422a-bbcc-aae6e4f11958",
}

export enum CustomAttributeValueName {
  AllNatural = "All-Natural",
  Ingredients = "Ingredients",
  ShortDescription = "Short-description",
  SubCategory = "Sub-Category",
  Weight = "Weight",
}

export enum CustomAttributeValueType {
  Boolean = "BOOLEAN",
  Number = "NUMBER",
  Selection = "SELECTION",
  String = "STRING",
}

export interface ItemVariationData {
  item_id: string;
  name: string;
  ordinal: number;
  pricing_type: PricingType;
  price_money: PriceMoney;
  location_overrides?: LocationOverride[];
  track_inventory?: boolean;
  sellable: boolean;
  stockable: boolean;
  item_option_values?: ItemOptionValue[];
  service_duration?: number;
  available_for_booking?: boolean;
  transition_time?: number;
  team_member_ids?: string[];
  price_description?: string;
}

export interface ItemOptionValue {
  item_option_id: string;
  item_option_value_id: string;
}

export interface LocationOverride {
  location_id: LocationID;
  track_inventory: boolean;
  inventory_alert_type?: string;
  sold_out?: boolean;
}

export interface PriceMoney {
  amount: number;
  currency: Currency;
}

export enum Currency {
  Aud = "AUD",
}

export enum PricingType {
  FixedPricing = "FIXED_PRICING",
}

export enum VariationType {
  ItemVariation = "ITEM_VARIATION",
}
