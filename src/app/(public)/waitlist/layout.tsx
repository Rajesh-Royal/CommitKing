import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import AppProviderWithoutHeader from "@/providers/AppProviderWithoutHeaderFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CommitKings - Join the Waitlist",
  description: "Rate GitHub profiles and repositories. Join the waitlist to be first to discover amazing developers!",
};

export default function WaitlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviderWithoutHeader>
          {children}
        </AppProviderWithoutHeader>
      </body>
    </html>
  );
}
