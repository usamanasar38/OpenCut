import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { DevelopmentDebug } from "../components/development-debug";
import { StorageProvider } from "../components/storage-provider";
import { Toaster } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { baseMetaData } from "./metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = baseMetaData;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" forcedTheme="dark" enableSystem>
          <TooltipProvider>
            <StorageProvider>{children}</StorageProvider>
            <Analytics />
            <Toaster />
            <DevelopmentDebug />
            <Script
              src="https://app.databuddy.cc/databuddy.js"
              strategy="afterInteractive"
              async
              data-client-id="UP-Wcoy5arxFeK7oyjMMZ"
              data-track-attributes={true}
              data-track-errors={true}
              data-track-outgoing-links={true}
              data-track-web-vitals={true}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
