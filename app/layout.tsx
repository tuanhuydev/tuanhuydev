import { ErrorBoundary } from "./resources/components/common/ErrorBoundary";
import Loader from "./resources/components/common/Loader";
import ThemeProvider from "./resources/components/common/providers/ThemeProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { sourceCodeFont, spaceGrotesk } from "@resources/font";
import "@resources/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { type Metadata, type Viewport } from "next";
import { PropsWithChildren, Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "tuanhuydev - Fullstack Software Engineer",
    template: "%s | tuanhuydev",
  },
  description:
    "Huy Nguyen Tuan's personal site. Fullstack engineer from Vietnam sharing posts on web development, React, Next.js, and software craft.",
  metadataBase: new URL("https://tuanhuy.dev"),
  authors: [{ name: "Huy Nguyen Tuan", url: "https://tuanhuy.dev" }],
  creator: "Huy Nguyen Tuan",
  openGraph: {
    siteName: "tuanhuydev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@tuanhuydev",
    site: "@tuanhuydev",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "gYd2c34ZXyS2chY0g_MILlCnSJ5DyhRb2VEwm4ilqRk",
  },
};

export const runtime = "nodejs";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export const preferredRegion = "auto";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${sourceCodeFont.className} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth">
      <head />
      <body>
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <TooltipProvider>{children}</TooltipProvider>
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
        {isDevelopmentEnv && <SpeedInsights />}
        <Analytics />
        <GoogleTagManager gtmId="G-19W3TP7JLT" />
      </body>
    </html>
  );
}
