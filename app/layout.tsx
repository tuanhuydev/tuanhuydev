"use client";

import { Providers } from "./_components/commons/providers/QueryProvider";
import { sourceCodeFont } from "./font";
import ThemeProvider from "@components/commons/providers/ThemeProvider";
import { GOOGLE_TAG, NODE_ENV } from "@lib/configs/constants";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "@styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const GoogleAdsense = dynamic(() => import("@components/GoogleAdsense"), { ssr: false });
const Analytics = dynamic(async () => (await import("@vercel/analytics/react")).Analytics, { ssr: false });

const isProductionEnv = NODE_ENV === "production";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        <GoogleAdsense />
        {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
        {isProductionEnv && GOOGLE_TAG && <GoogleAnalytics gaId={GOOGLE_TAG} />}
      </head>
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
        {isProductionEnv && <Analytics />}
      </body>
    </html>
  );
}
