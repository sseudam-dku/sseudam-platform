import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sseudam",
    template: "%s | Sseudam",
  },
  description: "Sseudam web application",
  applicationName: "Sseudam",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Sseudam",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#16745b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
