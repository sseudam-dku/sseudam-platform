import type { Metadata, Viewport } from "next";

import AppProviders from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "쓰담",
    template: "%s | 쓰담",
  },
  description: "우리 동네 맞춤 분리배출 가이드",
  applicationName: "쓰담",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo-nobg.png",
    apple: "/logo-pwa.png",
  },
  appleWebApp: {
    capable: true,
    title: "쓰담",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-dvh overflow-hidden bg-neutral-300">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body className="h-dvh overflow-hidden">
        <main className="mx-auto flex h-dvh w-full max-w-107.5 flex-col overflow-hidden bg-neutral-50">
          <AppProviders>{children}</AppProviders>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
