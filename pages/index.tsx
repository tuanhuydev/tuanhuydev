import type { NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@frontend/components/layouts/BaseLayout";
import Hero from "@frontend/components/home/Hero";
import Experience from "@frontend/components/home/Experience";


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
        <section>Contact</section>
      </BaseLayout>
    </div>
  );
};

export default Home;
