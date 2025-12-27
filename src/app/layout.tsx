import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const appTitle = process.env.NEXT_PUBLIC_APP_TITLE ?? "CourtKing";
const appDescription =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "Badminton Flex-League";

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: appTitle,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
