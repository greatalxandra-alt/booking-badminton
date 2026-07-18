import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Booking Lapangan Badminton",
  description: "Booking Lapangan Badminton Mudah, Tanpa Ribet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-body bg-surface-darker text-text-primary">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
