import { getPosts } from "../server/actions/blog";
import Hero from "@app/components/HomeModule/Hero";
import Navbar from "@app/components/HomeModule/Navbar";
import Services from "@app/components/HomeModule/ServiceSection/Services";
import { Post } from "@lib/types";
import { Metadata } from "next";
import dynamicImport from "next/dynamic";

const Contact = dynamicImport(() => import("@app/components/HomeModule/Contact"));
const BlogSection = dynamicImport(() => import("@app/components/HomeModule/BlogSection"));
const Footer = dynamicImport(() => import("@app/components/HomeModule/Footer"));

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
  let posts: Post[] = [];
  try {
    posts = await getPosts({ page: 1, pageSize: 4, published: true });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <main className="bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d" data-testid="homepage-testid">
      <div className="container mx-auto">
        <Navbar posts={posts} />
        <div className="relative">
          <Hero />
          <Services />
          <BlogSection posts={posts} />
          <Contact />
          {/* <audio id="audio" src="/assets/sounds/click.wav" controls>
            Your browser does not support the
            <code>audio</code> element.
          </audio> */}
        </div>
        <Footer />
      </div>
    </main>
  );
}
