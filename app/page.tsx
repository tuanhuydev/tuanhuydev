import HomeLayout from "@lib/HomeModule/HomeLayout";
import Loader from "@lib/components/commons/Loader";
import { BASE_URL } from "@lib/configs/constants";
import dynamic from "next/dynamic";
import React from "react";

async function getData() {
  const response = await fetch(`${BASE_URL}/api/posts?page=1&pageSize=4&active=true`, { cache: "no-store" });
  if (!response.ok) return [];

  const { data: posts } = await response.json();
  return posts;
}
const Hero = dynamic(async () => (await import("@lib/HomeModule/Hero")).default, { loading: () => <Loader /> });
const Contact = dynamic(async () => (await import("@lib/HomeModule/Contact")).default, { loading: () => <Loader /> });
const Services = dynamic(async () => (await import("@lib/HomeModule/Services")).default, { loading: () => <Loader /> });
const BlogSection = dynamic(async () => (await import("@lib/HomeModule/BlogSection")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default async function Home() {
  const posts = await getData();
  return (
    <HomeLayout>
      <Hero />
      <Services />
      <BlogSection posts={posts} />
      <Contact />
      <audio id="audio" src="/assets/sounds/click.wav">
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </HomeLayout>
  );
}
