import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { prisma } from "@/backend/utils/prisma";
import { MailService } from "@sendgrid/mail";
import moment from "moment";

//generate 5 digit random number for verification code
const generateAuthtoken = (): number => {
  return Math.floor(Math.random() * 90000) + 10000;
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  debug: true,
  pages: {
    signIn: "/login",
    signOut: "/",
    verifyRequest: "/verify-code",
    error: "/error",
  },

  providers: [
    GoogleProvider({
      id: "google",
      name: "google",
      clientId: process.env.GOOGLE_NEXT_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_NEXT_AUTH_CLIENT_SECRET as string,
      checks: "pkce",
    }),
    FacebookProvider({
      id: "facebook",
      name: "facebook",
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.DO_NOT_REPLY_EMAIL,
          pass: process.env.DO_NOT_REPLY_EMAIL_PASS,
        },
      },
      secret: process.env.NEXTAUTH_SECRET,

      from: process.env.DO_NOT_REPLY_EMAIL,
      maxAge: 5 * 60,
      generateVerificationToken() {
        const token = generateAuthtoken().toString();
        return token;
      },
      sendVerificationRequest: async ({
        identifier: email,
        url,
        token,
        expires,
        provider,
      }) => {
        const { server, from } = provider;
        // Strip protocol from URL and use domain as site name
        const site = (process.env.API_URL as string).replace(
          /^https?:\/\//,
          ""
        );
        const templateData = {
          verificationToken: token,
          expiryTime: moment(expires).format("LLL"),
        };
        const sgMail = new MailService();
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
        await sgMail.send({
          templateId: "d-c50bf55c36974432ae1527c8898ffe8b",
          to: email, // Change to your recipient
          from: "contact@thecheekco.com", // Change to your verified sender
          subject: "Your One-Time Password from The Cheek Co.",
          dynamicTemplateData: templateData,
        });
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    async session({ session, user, token }) {
      session.user = user as User;
      session.token = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
