import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import * as jose from "jose";
import { setCookie } from "nookies";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    signOut: "/",
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
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
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

    async session({ session, user }) {
      session.user = user as User;
      return session;
    },
  },
};

export default NextAuth(authOptions);
