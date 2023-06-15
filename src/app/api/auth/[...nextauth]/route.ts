import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserQueryResult } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

type User = {
  id: string;
  name: string;
  email: string;
};

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
        const userResult = await getUserQueryResult(credentials.email);
        if (userResult.count === 0) {
          throw new Error("No user found!");
        }
        const user = userResult[0];
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Could not log you in!");
        }
        //NextAuth requires a user to have name and email, so I pass email as both
        return { id: user.id, name: user.email, email: user.email } as User;
      },
    }),
  ],
  pages: {
    signIn: "/authform",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
