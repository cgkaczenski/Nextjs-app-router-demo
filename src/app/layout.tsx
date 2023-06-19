import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/navbar";
import Provider from "@/components/provider";
import { Toaster } from "react-hot-toast";

const title = "Next.js Postgres Auth Starter";
const description =
  "This is a Next.js demo that uses Next-Auth for simple email + password login and a Postgres database to persist the data.";

export const metadata: Metadata = {
  title,
  description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
