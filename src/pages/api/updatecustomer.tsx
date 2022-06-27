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
  const sgMail = new MailService();
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const orderId = event.data.id;
  const dbOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  if (!dbOrder) {
    return response.status(404).send("Order not found in database 😟");
  }
  if (event.type === "order.created") {
    try {
      if (dbOrder?.orderSuccessEmailSent) {
        return response.status(200).json({
          message: "Order email already sent 👍",
        });
      }
      const getOrder = await ordersApi.retrieveOrder(orderId);
      const orderResult = getOrder?.result?.order;
      const subtotal = `$${(
        (Number(orderResult?.totalMoney?.amount) -
          Number(orderResult?.totalMoney?.amount) * 0.1) /
        100
      ).toFixed(2)}`;
      const gst = `$${(
        (Number(orderResult?.totalMoney?.amount) * 0.1) /
        100
      ).toFixed(2)}`;
      const total = `$${(Number(orderResult?.totalMoney?.amount) / 100).toFixed(
        2
      )}`;
      const templateData = {
        order: {
          id: orderResult?.id,
          subtotal: subtotal,
          gst: gst,
          total: total,
          customer: {
            name:
              orderResult?.fulfillments?.[0].shipmentDetails?.recipient
                ?.displayName ||
              orderResult?.fulfillments?.[0].pickupDetails?.recipient
                ?.displayName ||
              "",
            email:
              orderResult?.fulfillments?.[0].shipmentDetails?.recipient
                ?.emailAddress ||
              orderResult?.fulfillments?.[0].pickupDetails?.recipient
                ?.emailAddress ||
              "",
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
        subject: "Thanks! Your order has been receieved!",
        dynamicTemplateData: templateData,
      });
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
      return response.status(500).json({ message: `${error.meta.cause}` });
    }
  } else if (event.type === "order.fulfillment.updated") {
    const oldState =
      event.data.object.order_fulfillment_updated?.fulfillment_update?.[0]
        .old_state;
    const newState =
      event.data.object.order_fulfillment_updated?.fulfillment_update?.[0]
        .new_state;

    if (oldState === "PROPOSED" && newState === "RESERVED") {
      return response
        .status(200)
        .json({ message: "No need to email for In Progress 😄" });
    }
    if (newState === "COMPLETED") {
      if (dbOrder?.orderShippedEmailSent) {
        return response.status(200).json({
          message: "Shipment email already sent 👍",
        });
      } else {
        try {
          const getOrder = await ordersApi.retrieveOrder(orderId);
          const orderResult = getOrder?.result?.order;
          const subtotal = `$${(
            (Number(orderResult?.totalMoney?.amount) -
              Number(orderResult?.totalMoney?.amount) * 0.1) /
            100
          ).toFixed(2)}`;
          const gst = `$${(
            (Number(orderResult?.totalMoney?.amount) * 0.1) /
            100
          ).toFixed(2)}`;
          const total = `$${(
            Number(orderResult?.totalMoney?.amount) / 100
          ).toFixed(2)}`;

          const templateData = {
            order: {
              id: orderResult?.id,
              carrier: orderResult?.fulfillments?.[0].shipmentDetails?.carrier,
              trackingNumber:
                orderResult?.fulfillments?.[0].shipmentDetails?.trackingNumber,
              subtotal: subtotal,
              gst: gst,
              total: total,
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
                  price: `$${(
                    Number(item?.basePriceMoney?.amount) / 100
                  ).toFixed(2)}`,
                };
              }),
            },
          };
          const result = await sgMail.send({
            templateId: "d-d245cf1d52aa4bc8abf18e2151da6ab4",
            to: "danieldeveney@hotmail.com", // Change to your recipient
            from: "contact@thecheekco.com", // Change to your verified sender
            subject: "Great news! Your order has been shipped!",
            dynamicTemplateData: templateData,
          });
          if (result[0].statusCode === 202) {
            const updatedOrder = await prisma.order.update({
              where: {
                id: orderId,
              },
              data: {
                orderShippedEmailSent: true,
                orderShippedEmailSentDateTime: new Date(),
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
          return response.status(500).json({ message: `${error.meta.cause}` });
        }
      }
    } else if (newState === "PREPARED") {
      if (dbOrder?.orderShippedEmailSent) {
        return response.status(200).json({
          message: "Pickup email already sent 👍",
        });
      } else {
        try {
          const getOrder = await ordersApi.retrieveOrder(orderId);
          const orderResult = getOrder?.result?.order;
          const subtotal = `$${(
            (Number(orderResult?.totalMoney?.amount) -
              Number(orderResult?.totalMoney?.amount) * 0.1) /
            100
          ).toFixed(2)}`;
          const gst = `$${(
            (Number(orderResult?.totalMoney?.amount) * 0.1) /
            100
          ).toFixed(2)}`;
          const total = `$${(
            Number(orderResult?.totalMoney?.amount) / 100
          ).toFixed(2)}`;

          const templateData = {
            order: {
              id: orderResult?.id,
              subtotal: subtotal,
              gst: gst,
              total: total,
              customer: {
                name:
                  orderResult?.fulfillments?.[0].pickupDetails?.recipient
                    ?.displayName || "",
                email:
                  orderResult?.fulfillments?.[0].pickupDetails?.recipient
                    ?.emailAddress || "",
              },
              lineItems: orderResult?.lineItems?.map((item) => {
                return {
                  name: item?.name,
                  quantity: item?.quantity,
                  price: `$${(
                    Number(item?.basePriceMoney?.amount) / 100
                  ).toFixed(2)}`,
                };
              }),
            },
          };
          const result = await sgMail.send({
            templateId: "d-d912e872425445a8b2ce929643655934",
            to: "danieldeveney@hotmail.com", // Change to your recipient
            from: "contact@thecheekco.com", // Change to your verified sender
            subject: "Great news! Your order is ready for collection!",
            dynamicTemplateData: templateData,
          });
          if (result[0].statusCode === 202) {
            const updatedOrder = await prisma.order.update({
              where: {
                id: orderId,
              },
              data: {
                orderShippedEmailSent: true,
                orderShippedEmailSentDateTime: new Date(),
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
          return response.status(500).json({ message: `${error.meta.cause}` });
        }
      }
    }
  }
}
