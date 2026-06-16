import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Project",
  description: "Created with v0 and Bolt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
