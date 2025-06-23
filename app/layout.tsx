import Loader from "./components/commons/Loader";
import ThemeScript from "./components/commons/ThemeScript";
import { sourceCodeFont } from "./font";
import "@app/_styles/globals.scss";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { PropsWithChildren, Suspense, lazy } from "react";

// Enable Partial Prerendering
export const runtime = "nodejs";
export const preferredRegion = "auto";

const QueryProvider = lazy(() => import("@app/components/commons/providers/QueryProvider"));

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head />
      <body>
        <ThemeScript />
        <Suspense fallback={<Loader />}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
        {isDevelopmentEnv && <SpeedInsights />}
        <Analytics />
        <GoogleTagManager gtmId="G-19W3TP7JLT" />
      </body>
    </html>
  );
}
