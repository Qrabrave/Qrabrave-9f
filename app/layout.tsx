import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Swapped Geist for Inter
import "./globals.css";

// Initialize the Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
