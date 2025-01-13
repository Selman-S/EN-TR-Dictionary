import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DarkModeProvider } from "@/providers/DarkModeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "English-Turkish Dictionary",
  description: "A comprehensive English-Turkish dictionary application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
