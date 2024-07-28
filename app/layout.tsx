"use client";

import { sourceCodeFont } from "./font";
import { QueryProvider } from "@components/commons/providers/QueryProvider";
import ThemeProvider from "@components/commons/providers/ThemeProvider";
import { GOOGLE_ADSENSE, GOOGLE_ANALYTIC, GOOGLE_TAG, isProductionEnv } from "@lib/configs/constants";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "@styles/globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Fragment, PropsWithChildren } from "react";

const GoogleAdsense = dynamic(() => import("@components/GoogleAdsense"), { ssr: false });

const App = dynamic(() => import("antd/es/app"), { ssr: false });

export default function RootLayout({ children }: PropsWithChildren) {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const isPostBySlug = pathName.includes("/post/");
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        {(isHomePage || isPostBySlug) && (
          <Fragment>
            {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
            {isProductionEnv && GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
            {isProductionEnv && GOOGLE_ADSENSE && <GoogleAdsense />}
          </Fragment>
        )}
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <QueryProvider>
              <App>{children}</App>
            </QueryProvider>
          </ThemeProvider>
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
