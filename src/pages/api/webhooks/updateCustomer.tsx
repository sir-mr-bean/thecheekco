import { NextApiRequest, NextApiResponse } from "next";
import { MailService } from "@sendgrid/mail";

const emailBody = `
    <h1>The Cheek Co</h1>
    `;

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const sgMail = new MailService();
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const msg = {
    to: "danieldeveney@hotmail.com", // Change to your recipient
    from: "contact@thecheekco.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });

  response
    .status(200)
    .json({ message: "Email sent!", request: request, response: response });
}
