import { CartObject } from "@/types/CartObject";
import { CatalogObject } from "square";

const useShippingRate = (products: CatalogObject[] | CartObject[]) => {
  console.log(products);
  const shippingRates = [
    {
      weight: 500,
      price: "9.30",
    },
    {
      weight: 1000,
      price: "12.70",
    },
    {
      weight: 3000,
      price: "15.95",
    },
    {
      weight: 5000,
      price: "19.20",
    },
  ];
  let totalShippingCost = 0;
  products.forEach((product) => {
    const productWeight = Number(
      product.itemData?.variations?.[0]?.customAttributeValues?.[
        "Square:3ba5a5e4-f9c6-46dc-abb9-d799ca83d91e"
      ]?.numberValue
    );
    const productShippingRate = shippingRates.find(
      (rate) => rate.weight <= productWeight
    );
    totalShippingCost += Number(productShippingRate?.price);
  });
  return totalShippingCost.toFixed(2);
};

export default useShippingRate;
