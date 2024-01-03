import HomeLayout from "@lib/HomeModule/HomeLayout";
import Loader from "@lib/components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const Hero = dynamic(() => import("@lib/HomeModule/Hero"), { loading: () => <Loader /> });
const Contact = dynamic(() => import("@lib/HomeModule/Contact"), { loading: () => <Loader /> });
const Services = dynamic(() => import("@lib/HomeModule/Services"), { loading: () => <Loader /> });
const BlogSection = dynamic(() => import("@lib/HomeModule/BlogSection"), { loading: () => <Loader /> });

export default async function Home() {
  return (
    <HomeLayout>
      <Hero />
      <Services />
      <BlogSection />
      <Contact />
      <audio id="audio" src="/assets/sounds/click.wav">
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </HomeLayout>
  );
}
