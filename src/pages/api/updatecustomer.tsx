import { NextApiRequest, NextApiResponse } from "next";
import { MailService } from "@sendgrid/mail";
import { trpc } from "@/utils/trpc";
import {
  Client,
  Environment,
  OrderCreated,
  OrderFulfillmentUpdatedUpdate,
} from "square";
import { prisma } from "@/backend/utils/prisma";
import { Order } from "@prisma/client";
import { SqEvent } from "@square/web-sdk";
import { SquareEvent } from "@/types/SquareEvent";

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
  const event = request.body as SquareEvent;

  console.log(request.body as SqEvent);
  const sgMail = new MailService();
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const type = event.type;
  const orderId = event.data.id;

  if (event.type === "order.created") {
    const dbOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    try {
      if (dbOrder?.orderSuccessEmailSent) {
        return response.status(200).json({
          message: "Order email already sent 👍",
        });
      }
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
      const result = await sgMail.send({
        templateId: "d-4738feab78164214b2d1c6a9229f670f",
        to: "danieldeveney@hotmail.com", // Change to your recipient
        from: "contact@thecheekco.com", // Change to your verified sender
        subject: "Thanks for your order!",
        dynamicTemplateData: templateData,
      });
      console.log(result);
      if (result[0].statusCode === 202) {
        const updatedOrder = await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            orderSuccessEmailSent: true,
            orderSuccessEmailSentDateTime: new Date(),
          },
        });
        if (updatedOrder) {
          return response
            .status(200)
            .json({ message: "Email sent and DB updated!" });
        }
      } else {
        return response
          .status(500)
          .json({ message: "Failed to send email :(" });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Error" });
    }
  } else if (event.type === "order.updated") {
    console.log("order.updated");
  } else if (event.type === "order.fulfillment.updated") {
    console.log("order.fulfillment.updated");
    const newState = JSON.parse(JSON.stringify(request.body)).data.object
      .order_fulfillment_updated.fulfillment_update.state;
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
}
