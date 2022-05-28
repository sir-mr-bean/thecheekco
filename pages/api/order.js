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
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: "AUD",
        amount: req.body.amount,
      },
    });
    console.log(result);
    res.status(200).json(result.payment);
  } else {
    res.status(500).json(result.payment);
  }
}
