import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import * as jose from "jose";
import { setCookie } from "nookies";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    encode: async ({ secret, token }) => {
      const jwtToken = await new jose.SignJWT({ token: token })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(`${secret}`));
      return jwtToken;
    },
    decode: async ({ secret, token }) => {
      const { payload: jwtData } = await jose.jwtVerify(
        token as string,
        new TextEncoder().encode(`${secret}`)
      );
      return jwtData;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_NEXT_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_NEXT_AUTH_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    async session({ session, token, user }) {
      session.user = user as User;
      return session;
    },
  },
};

export default NextAuth(authOptions);
