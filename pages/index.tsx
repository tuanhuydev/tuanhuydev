import type { NextPage } from 'next'
import Head from 'next/head';
import BaseLayout from '@frontend/components/layouts/BaseLayout';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>tuanhuydev</title>
        <meta name="description" content="Huy Nguyen Tuan personal website" /> 
      </Head>
        <BaseLayout>
          <section>About Me</section>
          <section>Experience</section>
          <section>Contact</section>
        </BaseLayout>
    </div>
  )
}

export default Home
