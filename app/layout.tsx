import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";

import { Roboto } from "next/font/google"; // Add this import
import { ConfettiProvider } from "@/components/providers/confetti-provider";

// Define the font
const roboto = Roboto({
  subsets: ["latin"],
  weight: "400", // Specify the weight you want
});

export const metadata: Metadata = {
  title: "My LMS",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className}  antialiased`}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
