import { ErrorBoundary } from "./resources/components/common/ErrorBoundary";
import Loader from "./resources/components/common/Loader";
import ThemeProvider from "./resources/components/common/providers/ThemeProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { sourceCodeFont, spaceGrotesk } from "@resources/font";
import "@resources/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  BASE_URL,
  GOOGLE_ANALYTIC,
  GOOGLE_SITE_VERIFICATION,
  GOOGLE_TAG,
  isDevelopmentEnv,
} from "lib/commons/constants/base";
import { type Metadata, type Viewport } from "next";
import Script from "next/script";
import { PropsWithChildren, Suspense } from "react";

const personLinkingData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Huy Nguyen Tuan",
  alternateName: "tuanhuydev",
  url: BASE_URL,
  jobTitle: "Fullstack Software Engineer",
  email: "mailto:tuanhuydev@gmail.com",
  sameAs: ["https://github.com/tuanhuydev", "https://www.linkedin.com/in/tuanhuydev"],
};

const websiteLinkingData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "tuanhuydev",
  url: BASE_URL,
};

export const metadata: Metadata = {
  title: {
    default: "tuanhuydev - Fullstack Software Engineer",
    template: "%s | tuanhuydev",
  },
  description:
    "Huy Nguyen Tuan's personal site. Fullstack engineer from Vietnam sharing posts on web development, React, Next.js, and software craft.",
  metadataBase: new URL(BASE_URL),
  authors: [{ name: "Huy Nguyen Tuan", url: BASE_URL }],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLinkingData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLinkingData) }} />
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
        {GOOGLE_TAG && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}`} strategy="afterInteractive" />
            <Script id="google-tag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_TAG}');
                ${GOOGLE_ANALYTIC && GOOGLE_ANALYTIC !== GOOGLE_TAG ? `gtag('config', '${GOOGLE_ANALYTIC}');` : ""}
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
