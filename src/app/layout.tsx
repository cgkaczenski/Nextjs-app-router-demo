import MainNavigation from "./nav";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainNavigation />
        {children}
      </body>
    </html>
  );
}
