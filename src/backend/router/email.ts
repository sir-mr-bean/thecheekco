import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";
import { SMTPClient } from "emailjs";
import * as z from "zod";
import { MailService } from "@sendgrid/mail";

export const emailRouter = createRouter()
  .mutation("sendEmail", {
    input: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      company: z.string().optional(),
      email: z.string().optional(),
      phoneNumber: z.string().optional(),
      message: z.string().optional(),
      type: z.string().optional(),
      requiredDate: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const {
        firstName,
        lastName,
        company,
        email,
        phoneNumber,
        message,
        type,
        requiredDate,
      } = input;
      const { prisma } = ctx;
      const client = new SMTPClient({
        user: process.env.EMAILACCOUNT,
        password: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST,
        ssl: true,
        port: 465,
      });
      const emailBody = `
    <h1>The Cheek Co</h1>
    <p>
        ${firstName} ${lastName} has sent you a message:
    </p>
    <p>
        ${message}
    </p>
    <p>
        Company: ${company}
    </p>
    <p>
        Email Address: ${email}
    </p>
    <p>
        Phone Number: ${phoneNumber}
    </p>
    `;
      const requestBody = `
    <h1>The Cheek Co</h1>
    <p>
        ${firstName} ${lastName} has sent you a special request!
    </p>
    <p>
        Request Type: ${type}
    </p>
    <p>
        Required by: ${requiredDate}
    </p>
    <p>
        ${message}
    </p>
    <p>
        Company: ${company}
    </p>
    <p>
        Email Address: ${email}
    </p>
    <p>
        Phone Number: ${phoneNumber}
    </p>
    `;
      try {
        client.send(
          {
            text: type === null ? emailBody : requestBody,
            from: process.env.EMAILACCOUNT as string,
            to: "kroucher.1019@hotmail.com",
            subject:
              type === null
                ? "New Contact Form Submission"
                : "New Special Request Form Submission",
            attachment: [
              {
                data: type === null ? emailBody : requestBody,
                alternative: true,
              },
            ],
          },
          (err, message) => {
            console.log(err || message);
          }
        );
      } catch (e) {
        console.log(e);
        ctx?.res?.status(400).end(JSON.stringify({ e }));
        throw new TRPCError(e as TRPCError);
      }
      return {
        result: "success",
      };
    },
  })
  .mutation("send-cheekybox-selections", {
    input: z.object({
      duration: z.string(),
      customer: z.object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string().optional(),
        email: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postCode: z.string(),
        country: z.literal("Australia"),
      }),
      recipient: z.object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string().optional(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postCode: z.string(),
        country: z.literal("Australia"),
      }),
      selections: z.object({
        pageOne: z.object({
          bath: z.boolean(),
          shower: z.boolean(),
          both: z.boolean(),
        }),
        pageTwo: z.object({
          shampooBar: z.boolean(),
          conditioner: z.boolean(),
          bodyWash: z.boolean(),
          bodyButter: z.boolean(),
          soapBar: z.boolean(),
          bathSoak: z.boolean(),
          beautyTools: z.boolean(),
          hygieneAccessories: z.boolean(),
        }),
        pageThree: z.object({
          floral: z.boolean(),
          allNatural: z.boolean(),
          darkAndSexy: z.boolean(),
          fruity: z.boolean(),
          sweet: z.boolean(),
          fragranceFree: z.boolean(),
          allergies: z.string().optional(),
        }),
        pageFour: z.object({
          dry: z.boolean(),
          oily: z.boolean(),
          combination: z.boolean(),
          mild: z.boolean(),
          medium: z.boolean(),
          high: z.boolean(),
        }),
        pageFive: z.object({
          hair: z.boolean(),
          skin: z.boolean(),
          sleep: z.boolean(),
          bathroomAccessories: z.boolean(),
          homeDecor: z.boolean(),
          wearable: z.boolean(),
        }),
      }),
      gifted: z.boolean(),
      giftMessage: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const { customer, recipient, selections, gifted, giftMessage } = input;
      //const { prisma } = ctx;
      const sgMail = new MailService();
      sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
      const templateData = {
        customer: customer,
        recipient: recipient,
        selections: selections,
        gifted: gifted,
        giftMessage: giftMessage,
      };
      const result = await sgMail.send({
        templateId: "d-ede5c253026645d8b55ebc8e40f2c25e",
        to: "admin@thecheekco.com", // Change to your recipient
        from: "contact@thecheekco.com", // Change to your verified sender
        subject: "🎁 New Cheeky Box Subscription! 🎁",
        dynamicTemplateData: templateData,
      });
      if (result[0].statusCode === 202) {
        return {
          success: true,
        };
      } else {
        return {
          success: result?.[0].statusCode,
        };
      }
    },
  })
  .mutation("send-cheekybox-customer-email", {
    input: z.object({
      customer: z.object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string().optional(),
        email: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postCode: z.string(),
        country: z.literal("Australia"),
      }),
      duration: z.string(),
      recipient: z.object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string().optional(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postCode: z.string(),
        country: z.literal("Australia"),
      }),
      gifted: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      const { customer, duration, recipient, gifted } = input;
      //const { prisma } = ctx;
      const sgMail = new MailService();
      sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
      const templateData = {
        customer: customer,
        duration: duration,
        recipient: recipient,
        gifted: gifted,
      };
      const result = await sgMail.send({
        templateId: "d-f5f3358f12ee4c91ba703febfcb013fc",
        to: customer.email,
        from: "contact@thecheekco.com", // Change to your verified sender
        subject: "🎁 New Cheeky Box Subscription! 🎁",
        dynamicTemplateData: templateData,
      });
      if (result[0].statusCode === 202) {
        return {
          success: true,
        };
      } else {
        return {
          success: result?.[0].statusCode,
        };
      }
    },
  })
  .mutation("send-error-email", {
    input: z.object({
      error: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { error } = input;
      //const { prisma } = ctx;
      const sgMail = new MailService();
      sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
      const templateData = {
        error: error,
      };
      const result = await sgMail.send({
        templateId: "d-f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8",
        to: "kroucher.1019@gmail.com",
        from: "contact@thecheekco.com",
        subject: "❌ Something went wrong ❌",
        dynamicTemplateData: templateData,
      });
      if (result[0].statusCode === 202) {
        return {
          success: true,
        };
      } else {
        return {
          success: result?.[0].statusCode,
        };
      }
    },
  });
