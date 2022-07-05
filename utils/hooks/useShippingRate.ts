import { CartObject } from "@/types/CartObject";
import { CatalogObject } from "square";

function closestRate(arr: number[], closestTo: number) {
  var closest = Math.max.apply(null, arr);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] >= closestTo && arr[i] < closest) closest = arr[i];
  }
  return closest;
}

const useShippingRate = (products: CartObject[]) => {
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
  const totalWeight = products.reduce(
    (acc, cur) =>
      acc +
      cur.quantity *
        Number(
          cur.itemData?.variations?.[0]?.customAttributeValues?.[
            "Square:3ba5a5e4-f9c6-46dc-abb9-d799ca83d91e"
          ]?.numberValue
        ),
    0
  );
  const closestShippingRate = closestRate(
    shippingRates.map((rate) => rate.weight),
    totalWeight
  );
  const shippingRate = shippingRates.find(
    (rate) => rate.weight === closestShippingRate
  );
  if (shippingRate) {
    totalShippingCost = Number(shippingRate.price);
  }
  return totalShippingCost;
};

export default useShippingRate;
