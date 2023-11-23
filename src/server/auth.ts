import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { db } from "@/server/db";
import { loginSchema, signUpSchema } from "@/common/authSchema";
import { comparePassword } from "@/utils/passwordUtils";
import { tree } from "next/dist/build/templates/app-page";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        userName: {
          label: "User",
          type: "text",
          placeholder: "exampl",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {


        const creds = await signUpSchema.parseAsync(credentials);
        const user = await db.user.findFirst({
          where: { email: creds.email },
          select: {
            id: true,
            userName: true,
            email: true,
            password: true,
          }
        },);
        console.log(user)

        if (!user) {
          return null
        };

        if (!comparePassword(user.password, creds.password)) {
          console.log('passwords does not match')
          return null;
        }

        if (user) {
          console.log("User logged in : ", user);
        }

        return {
          ...user,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signUp",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
