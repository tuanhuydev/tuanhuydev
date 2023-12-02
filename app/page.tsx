import HomeLayout from "@lib/HomeModule/HomeLayout";
import Loader from "@lib/components/commons/Loader";
import { BASE_URL } from "@lib/configs/constants";
import { Post } from "@prisma/client";
import dynamic from "next/dynamic";
import React from "react";

const Hero = dynamic(async () => import("@lib/HomeModule/Hero"), { loading: () => <Loader /> });
const Contact = dynamic(async () => import("@lib/HomeModule/Contact"), { loading: () => <Loader /> });
const Services = dynamic(async () => import("@lib/HomeModule/Services"), { loading: () => <Loader /> });
const BlogSection = dynamic(async () => import("@lib/HomeModule/BlogSection"), { loading: () => <Loader /> });

async function getData() {
  const response = await fetch(`${BASE_URL}/api/posts?page=1&pageSize=4&active=true`, { cache: "no-store" });
  if (!response.ok) return [];

  const { data: posts } = await response.json();
  return posts;
}

export default async function Home() {
  const posts: Post[] = await getData();

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
