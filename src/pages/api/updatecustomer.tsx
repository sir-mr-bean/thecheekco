import { NextApiRequest, NextApiResponse } from "next";
import { MailService } from "@sendgrid/mail";
import { trpc } from "@/utils/trpc";
import { Client, Environment } from "square";

const { ordersApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const sgMail = new MailService();
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  //console.log(request);
  const type = JSON.parse(JSON.stringify(request.body)).type;
  const orderId = JSON.parse(JSON.stringify(request.body)).data.id;
  console.log(orderId);

  if (type === "order.created") {
    try {
      const getOrder = await ordersApi.retrieveOrder(orderId);
      const orderResult = getOrder?.result?.order;
      console.log(orderResult);
      const templateData = {
        order: {
          id: orderResult?.id,
          customer: {
            name:
              orderResult?.fulfillments?.[0].shipmentDetails?.recipient
                ?.displayName || "",
            email:
              orderResult?.fulfillments?.[0].shipmentDetails?.recipient
                ?.emailAddress || "",
          },
          lineItems: orderResult?.lineItems?.map((item) => {
            return {
              name: item?.name,
              quantity: item?.quantity,
              price: `$${(Number(item?.basePriceMoney?.amount) / 100).toFixed(
                2
              )}`,
            };
          }),
        },
      };
      console.log(templateData);
      sgMail
        .send({
          templateId: "d-4738feab78164214b2d1c6a9229f670f",
          to: "danieldeveney@hotmail.com", // Change to your recipient
          from: "contact@thecheekco.com", // Change to your verified sender
          subject: "Thanks for your order!",
          dynamicTemplateData: templateData,
        })
        .then((result) => {
          console.log(result);
          return;
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  } else if (type === "order.updated") {
    console.log("order.updated");
  } else if (type === "order.fulfillment.updated") {
    console.log("order.fulfillment.updated");
    const newState = JSON.parse(JSON.stringify(request.body)).data.object
      .order_fulfillment_updated.state;
    if (newState === "OPEN") {
      try {
        const getOrder = await ordersApi.retrieveOrder(orderId);
        const orderResult = getOrder?.result?.order;
        console.log(orderResult);
        const templateData = {
          order: {
            id: orderResult?.id,
            customer: {
              name:
                orderResult?.fulfillments?.[0].shipmentDetails?.recipient
                  ?.displayName || "",
              email:
                orderResult?.fulfillments?.[0].shipmentDetails?.recipient
                  ?.emailAddress || "",
            },
            lineItems: orderResult?.lineItems?.map((item) => {
              return {
                name: item?.name,
                quantity: item?.quantity,
                price: `$${(Number(item?.basePriceMoney?.amount) / 100).toFixed(
                  2
                )}`,
              };
            }),
          },
        };
        console.log(templateData);
        sgMail
          .send({
            templateId: "d-4738feab78164214b2d1c6a9229f670f",
            to: "danieldeveney@hotmail.com", // Change to your recipient
            from: "contact@thecheekco.com", // Change to your verified sender
            subject: "Great news! Your order has been updated!",
            dynamicTemplateData: templateData,
          })
          .then((result) => {
            console.log(result);
            return;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
    console.log(newState);
  }

  response.status(200).json({ message: "Email sent!" });
}
