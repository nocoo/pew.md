import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pew.md — Prairie Shooter",
  description: "A pixel art twin-stick shooter inspired by Journey of the Prairie King",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
