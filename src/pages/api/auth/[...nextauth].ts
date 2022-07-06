import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { prisma } from "@/backend/utils/prisma";
import { MailService } from "@sendgrid/mail";

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
    newUser: "/profile",
    verifyRequest: "/verify-code",
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
        console.log("generating token: ", token);
        return token;
      },
      sendVerificationRequest: ({
        identifier: email,
        url,
        token,
        expires,
        provider,
      }) => {
        // return new Promise((resolve, reject) => {
        const { server, from } = provider;
        // Strip protocol from URL and use domain as site name
        const site = (process.env.API_URL as string).replace(
          /^https?:\/\//,
          ""
        );
        console.log(email, url, token, expires, provider);
        //return resolve();

        // nodemailer.createTransport(server).sendMail(
        //   {
        //     to: email,
        //     from,
        //     subject: `Authentication code: ${token}`,
        //     text: text({ url, site, email, token }),
        //     html: html({ url, site, email, token }),
        //   },
        //   (error) => {
        //     if (error) {
        //       // logger.error('SEND_VERIFICATION_EMAIL_ERROR', email, error);
        //       console.error('SEND_VERIFICATION_EMAIL_ERROR', email, error);
        //       return reject(
        //         new Error(`SEND_VERIFICATION_EMAIL_ERROR ${error}`)
        //       );
        //     }
        //     return resolve();
        //   }
        // );
        //});
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
