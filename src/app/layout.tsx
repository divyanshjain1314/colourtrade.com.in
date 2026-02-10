import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ToasterProvider from "@/components/common/ToasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050A10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://colourtrade-com-in.vercel.app"),

  title: {
    default: "PlayWin - Play & Win Daily",
    template: "%s | PlayWin",
  },

  description: "The ultimate gaming platform. Join daily challenges, play exciting games, and win real rewards instantly.",

  keywords: ["gaming", "play to win", "rewards", "online games", "daily winnings", "instant withdrawal"],

  authors: [{ name: "PlayWin Team" }],
  creator: "PlayWin",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://colourtrade-com-in.vercel.app",
    title: "PlayWin - Play & Win Daily",
    description: "Join the ultimate gaming platform. Win big with daily challenges.",
    siteName: "PlayWin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlayWin Gaming Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PlayWin - Play & Win Daily",
    description: "Join the ultimate gaming platform. Win big with daily challenges.",
    images: ["/og-image.png"],
    creator: "@yourhandle",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ToasterProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
