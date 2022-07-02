import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";
import { SMTPClient } from "emailjs";
import * as z from "zod";

export const emailRouter = createRouter().mutation("sendEmail", {
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
          to: "danieldeveney@hotmail.com",
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
});
