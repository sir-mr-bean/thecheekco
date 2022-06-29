import { Client } from "square";
import { randomUUID } from "crypto";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { ordersApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: "sandbox",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { result } = await ordersApi.createOrder({
      idempotencyKey: randomUUID(),
      order: {
        locationId: req.body.order.locationId,
        referenceId: req.body.order.referenceId,
        lineItems: req.body.order.lineItems?.[0]?.map((item) => {
          return {
            catalogObjectId: item.catalogObjectId,
            quantity: item.quantity,
            // modifiers: item.modifiers?.map((modifier) => {
            //   return {
            //     catalogObjectId: modifier.catalogObjectId,
            //   };
            // }),
          };
        }),
      },
    });
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
}
