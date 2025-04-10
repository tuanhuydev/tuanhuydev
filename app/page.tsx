import LandingPage from "./[landing]/LandingPage";
import Transition from "./components/commons/Transition";
import { GOOGLE_ANALYTIC } from "@lib/shared/commons/constants/base";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { Fragment } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "tuanhuydev - Fullstack Software Engineer",
  description:
    "🚀 tuanhuydev is Huy Nguyen Tuan's personal website. He is a passionate, full-stack developer from Viet Nam ready to contribute to your business's success.",
  openGraph: {
    title: "tuanhuydev - Fullstack Software Engineer",
    description:
      "🚀 tuanhuydev is Huy Nguyen Tuan's personal website. He is a passionate, full-stack developer from Viet Nam ready to contribute to your business's success.",
    url: "https://tuanhuy.dev",
    siteName: "tuanhuydev",
    images: [
      {
        url: "/assets/images/preview.png",
        width: 800,
        height: 600,
      },
      {
        url: "/assets/images/preview.png",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon-16x16.png",
  },
  metadataBase: new URL("https://tuanhuy.dev"),
  keywords: "#WebDevelopment, #FullStack, #React, #Next.js, #Node.js, #AWS",
  manifest: "/site.webmanifest",
  category: "technology",
};

export default async function Home() {
  return (
    <Transition>
      <LandingPage />
      {GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
    </Transition>
  );
}
