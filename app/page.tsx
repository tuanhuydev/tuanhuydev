import Footer from "@components/HomeModule/Footer";
import Navbar from "@components/HomeModule/Navbar";
import Loader from "@components/commons/Loader";
import { BASE_URL } from "@lib/configs/constants";
import { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import React from "react";

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
    icon: "/icon.png",
  },
  metadataBase: new URL("https://tuanhuy.dev"),
  keywords: "#WebDevelopment, #FullStack, #React, #Next.js, #Node.js, #AWS",
  manifest: "/site.webmanifest",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

async function getData() {
  const response = await fetch(`${BASE_URL}/api/posts?page=1&pageSize=4&active=true`, { cache: "no-store" });
  if (!response.ok) return [];

  const { data: posts } = await response.json();
  return posts;
}

const Hero = dynamic(async () => (await import("@components/HomeModule/Hero")).default, { loading: () => <Loader /> });

const Contact = dynamic(async () => (await import("@components/HomeModule/Contact")).default, {
  loading: () => <Loader />,
});
const Services = dynamic(async () => (await import("@components/HomeModule/Services")).default, {
  loading: () => <Loader />,
});
const BlogSection = dynamic(async () => (await import("@components/HomeModule/BlogSection")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default async function Home() {
  const posts = await getData();
  return (
    <main className=" bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d" data-testid="homepage-testid">
      <div className="container mx-auto">
        <div className="sticky top-0 z-10">
          <Navbar posts={posts} />
        </div>
        <div className="relative">
          <Hero />
          <Services />
          <BlogSection posts={posts} />
          <Contact />
          <audio id="audio" src="/assets/sounds/click.wav">
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </div>
        <Footer />
      </div>
    </main>
  );
}
