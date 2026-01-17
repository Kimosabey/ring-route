import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-headings",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RingRoute | Distributed Consistent Hashing",
  description: "High-performance distributed request router visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${jetbrains.variable} antialiased font-body bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
