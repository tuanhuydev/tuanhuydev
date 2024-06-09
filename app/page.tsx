import Hero from "./_components/HomeModule/Hero";
import Services from "./_components/HomeModule/ServiceSection/Services";
import Loader from "./_components/commons/Loader";
import Navbar from "@app/_components/HomeModule/Navbar";
import { getPosts } from "@server/actions/blog";
import { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import React from "react";

const Contact = dynamic(() => import("@components/HomeModule/Contact"), { loading: () => <Loader /> });
const BlogSection = dynamic(() => import("@components/HomeModule/BlogSection"), { loading: () => <Loader /> });
const Footer = dynamic(() => import("@components/HomeModule/Footer"), { loading: () => <Loader /> });

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function Home() {
  const posts = await getPosts({ page: 1, pageSize: 4, published: true });

  return (
    <main className=" bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d" data-testid="homepage-testid">
      <div className="container mx-auto">
        <Navbar posts={posts} />
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
