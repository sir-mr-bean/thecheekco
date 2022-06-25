import { NextApiRequest, NextApiResponse } from "next";
import { SMTPClient } from "emailjs";

const emailBody = `
    <h1>The Cheek Co</h1>
    `;

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const client = new SMTPClient({
    user: process.env.EMAILACCOUNT,
    password: process.env.EMAIL_PASS,
    host: "smtp.mail.us-east-1.awsapps.com",
    ssl: true,
    port: 465,
  });
  const { name } = request.query;
  response.end(`Hello ${name}!`);
  try {
    client.send(
      {
        text: emailBody,
        from: process.env.EMAILACCOUNT as string,
        to: "danieldeveney@hotmail.com",
        subject: "Your order has been updated!",
        attachment: [
          {
            data: emailBody,
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
    response?.status(400).end(JSON.stringify({ e }));
  }
}
