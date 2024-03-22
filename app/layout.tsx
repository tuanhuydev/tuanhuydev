"use client";

import { QueryProvider } from "./_components/commons/providers/QueryProvider";
import getQueryClient from "./_configs/queryClient";
import { sourceCodeFont } from "./font";
import ThemeProvider from "@components/commons/providers/ThemeProvider";
import { GOOGLE_TAG, isProductionEnv } from "@lib/configs/constants";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "@styles/globals.scss";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const App = dynamic(() => import("antd/es/app"), { ssr: false });

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(getQueryClient())}>
        <App>{children}</App>
      </HydrationBoundary>
    </QueryProvider>
  );
};
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
        {isProductionEnv && GOOGLE_TAG && <GoogleAnalytics gaId={GOOGLE_TAG} />}
      </head>
      <body>
        <ThemeProvider>
          <Wrapper>{children}</Wrapper>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
