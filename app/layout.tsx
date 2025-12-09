import { ErrorBoundary } from "./resources/components/common/ErrorBoundary";
import Loader from "./resources/components/common/Loader";
import ThemeScript from "./resources/components/layout/ThemeScript";
import { GoogleTagManager } from "@next/third-parties/google";
import { sourceCodeFont } from "@resources/font";
import "@resources/styles/globals.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { PropsWithChildren, Suspense, lazy } from "react";

// Enable Partial Prerendering
export const runtime = "nodejs";
export const preferredRegion = "auto";

const QueryProvider = lazy(() => import("@resources/components/common/providers/QueryProvider"));

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head />
      <body>
        <ThemeScript />
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <QueryProvider>{children}</QueryProvider>
          </Suspense>
        </ErrorBoundary>
        {isDevelopmentEnv && <SpeedInsights />}
        <Analytics />
        <GoogleTagManager gtmId="G-19W3TP7JLT" />
      </body>
    </html>
  );
}
