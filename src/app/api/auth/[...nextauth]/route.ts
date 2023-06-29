import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { User } from "@/services/user";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        const user = await db.getUserByEmail(credentials.email);
        if (!user) {
          throw new Error("Could not find user");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Could not log you in!");
        }
        //NextAuth requires a user to have name and email, so I pass email as both
        return {
          id: user.id,
          name: user.email,
          email: user.email,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        name: token.name,
        email: token.email,
        isVerified: token.isVerified,
      } as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isVerified = user.isVerified;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
