import MainNavigation from "./nav";

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
