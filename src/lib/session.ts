import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { UserProfile } from "@/types";
import { createUser, getUser } from "./actions";
import mongoConnect from "./mongo-connect";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;
      try {
        await mongoConnect();
        const data = (await getUser({ email })) as { user?: UserProfile };
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data,
          },
        };
        return newSession;
      } catch (error: any) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },
    async signIn({ user }) {
      try {
        await mongoConnect();
        if (!user.email || !user) return false;
        const userExists = await getUser({ email: user?.email });

        if (!userExists) {
          await createUser({
            name: user.name || "",
            email: user.email,
            avatarUrl: user.image || "",
          });
        }

        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};
