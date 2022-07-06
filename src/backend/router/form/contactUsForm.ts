import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import * as z from "zod";
import { MailService } from "@sendgrid/mail";

import { emailValidation } from "@/pages/contact-us";

export const contactUsRouter = createRouter()
  .transformer(superjson)
  .mutation("send-email", {
    input: emailValidation,
    async resolve({ input }) {
      const sgMail = new MailService();
      sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
      const templateData = {
        firstName: input.firstName,
        lastName: input.lastName,
        company: input.company,
        email: input.email,
        phoneNumber: input.phoneNumber,
        message: input.message,
      };
      const result = await sgMail.send({
        templateId: "d-98e4d901efbe45b38ceef21bda78faae",
        to: "danieldeveney@hotmail.com", // Change to your recipient
        from: "contact@thecheekco.com", // Change to your verified sender
        subject: "🦦 New Message from Contact Us Form 🦦",
        dynamicTemplateData: templateData,
      });
      if (result[0].statusCode === 202) {
        return {
          success: true,
        };
      }
    },
  });
