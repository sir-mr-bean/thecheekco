import { CatalogObject } from "square";

export type CartObject = CatalogObject & {
  quantity: number;
  productImage?: string;
};
