import type { NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@frontend/components/layouts/BaseLayout";
import Hero from "@frontend/components/home/Hero";
import Experience from "@frontend/components/home/Experience";
import Contact from "@frontend/components/home/Contact";
import React from "react";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>tuanhuydev</title>
        <meta name="description" content="Huy Nguyen Tuan personal website" />
      </Head>
      <BaseLayout>
        <Hero />
        <Experience />
        <Contact />
        <audio id="audio" src="/assets/sounds/click.wav">
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </BaseLayout>
    </div>
  );
};

export default React.memo(Home, () => false);
