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
import { Fragment, PropsWithChildren, useMemo } from "react";

const GoogleAdsense = dynamic(() => import("@components/GoogleAdsense"), { ssr: false });

export default function RootLayout({ children }: PropsWithChildren) {
  const pathName = usePathname();

  const RenderGoogleTags = useMemo(() => {
    const isHomePage = pathName === "/";
    const isPostBySlug = pathName.includes("/post/");

    if (isHomePage || isPostBySlug) {
      return (
        <Fragment>
          {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
          {isProductionEnv && GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
          {isProductionEnv && GOOGLE_ADSENSE && <GoogleAdsense />}
        </Fragment>
      );
    }
    return <Fragment />;
  }, [pathName]);

  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>{RenderGoogleTags}</head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
