import { ErrorBoundary } from "./resources/components/common/ErrorBoundary";
import Loader from "./resources/components/common/Loader";
import ThemeProvider from "./resources/components/common/providers/ThemeProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { sourceCodeFont, spaceGrotesk } from "@resources/font";
import "@resources/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BASE_URL, GOOGLE_SITE_VERIFICATION, isDevelopmentEnv } from "lib/commons/constants/base";
import { type Metadata, type Viewport } from "next";
import { PropsWithChildren, Suspense } from "react";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Huy Nguyen Tuan",
  alternateName: "tuanhuydev",
  url: BASE_URL,
  jobTitle: "Fullstack Software Engineer",
  email: "mailto:tuanhuydev@gmail.com",
  sameAs: ["https://github.com/tuanhuydev", "https://www.linkedin.com/in/tuanhuydev"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "tuanhuydev",
  url: BASE_URL,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  ...(GOOGLE_SITE_VERIFICATION && { verification: { google: GOOGLE_SITE_VERIFICATION } }),
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
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
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
