"use client";

import { sourceCodeFont } from "./font";
import ThemeProvider from "@components/commons/providers/ThemeProvider";
import { GOOGLE_TAG, NODE_ENV } from "@lib/configs/constants";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "@styles/globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const Analytics = dynamic(async () => (await import("@vercel/analytics/react")).Analytics, { ssr: false });

const isProductionEnv = NODE_ENV === "production";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
        {isProductionEnv && GOOGLE_TAG && <GoogleAnalytics gaId={GOOGLE_TAG} />}
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        {isProductionEnv && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  );
}
