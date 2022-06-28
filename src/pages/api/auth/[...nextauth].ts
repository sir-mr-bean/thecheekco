import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import { setCookie } from "nookies";
import { prisma } from "@/backend/utils/prisma";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  debug: true,
  pages: {
    signIn: "/login",
    signOut: "/",
    newUser: "/profile",
    verifyRequest: "/verify-email",
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
      from: process.env.DO_NOT_REPLY_EMAIL,
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
      console.log("signIn", user, account, profile, email, credentials);
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
