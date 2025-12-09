import Transition from "./resources/components/common/Transition";
import LandingPage from "./resources/landing/LandingPage";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GOOGLE_ANALYTIC } from "lib/commons/constants/base";
import { Metadata } from "next";

// Use dynamic rendering only when necessary
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "auto";
export const revalidate = 3600; // Revalidate content every hour

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

const HomePageContent = ({ children }: { children: React.ReactNode }) => {
  return <Transition>{children}</Transition>;
};

export default function Home() {
  return (
    <HomePageContent>
      <LandingPage />
      {GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
    </HomePageContent>
  );
}
