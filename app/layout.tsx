"use client";

import { sourceCodeFont } from "./font";
import QueryProvider from "@components/commons/providers/QueryProvider";
import ReduxProvider from "@components/commons/providers/ReduxProvider";
import ThemeProvider from "@components/commons/providers/ThemeProvider";
import { GOOGLE_TAG, NODE_ENV } from "@lib/configs/constants";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "@styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const App = dynamic(() => import("antd/es/app"), { ssr: false });
const GoogleAdsense = dynamic(() => import("@components/GoogleAdsense"), { ssr: false });
const Analytics = dynamic(async () => (await import("@vercel/analytics/react")).Analytics, { ssr: false });

export default function RootLayout({ children }: PropsWithChildren) {
  const isProductionEnv = NODE_ENV === "production";
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        <GoogleAdsense />
        {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
        {isProductionEnv && GOOGLE_TAG && <GoogleAnalytics gaId={GOOGLE_TAG} />}
      </head>
      <body>
        <App>
          <ThemeProvider>
            <QueryProvider>
              <ReduxProvider>{children}</ReduxProvider>
            </QueryProvider>
          </ThemeProvider>
        </App>
        {isProductionEnv && <Analytics />}
      </body>
    </html>
  );
}
