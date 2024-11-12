/* eslint-disable @typescript-eslint/ban-ts-comment */
import { prismaInstance } from "@/lib/prismaInstance";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  pages: {
    newUser: "/user/signup",
    signIn: "/user/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      //   @ts-ignore
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials are required");
        }
        const userExist = await prismaInstance.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (!userExist) {
          throw new Error("Invalid User");
        }

        // compare the hased password
        const validPassword = await bcrypt.compare(
          credentials?.password,
          userExist?.password as string
        );

        if (!validPassword) {
          throw new Error("Invalid Credentials");
        }
        return {
          id: userExist?.id,
          username: userExist?.username,
          email: userExist?.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // @ts-ignore
        token.username = user.username;
        token.expires = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
      }
      return token;
    },
    session({ token, session }) {
      if (token) {
        // @ts-ignore
        session.user.id = token?.id;
        // @ts-ignore

        session.user.username = token?.username;
        // @ts-ignore

        session.user.email = token?.email;
        // @ts-ignore

        session.expires = new Date(token?.expires * 1000).toISOString();
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
});

export { handler as GET, handler as POST };
