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
    let productWeight = Number(
      product.itemData?.variations?.[0]?.customAttributeValues?.[
        "Square:3ba5a5e4-f9c6-46dc-abb9-d799ca83d91e"
      ]?.numberValue
    );
    if (product.quantity) {
      productWeight = productWeight * product.quantity;
      console.log("product weight is ", productWeight);
    }
    const productShippingRate = closestRate(
      shippingRates.map((rate) => {
        return rate.weight;
      }),
      productWeight
    );
    console.log("product shipping rate is ", productShippingRate);
    totalShippingCost += Number(
      shippingRates.find((rate) => rate.weight === productShippingRate)?.price
    );
  });

  return totalShippingCost;
};

export default useShippingRate;
