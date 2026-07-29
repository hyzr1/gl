import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hyzr GL",
  description:
    "A typed WebGL2 effects library with live documentation for React, Next.js, and vanilla JavaScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
