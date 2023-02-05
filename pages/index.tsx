import type { NextPage } from 'next'
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>@tuanhuydev</title>
        <meta name="description" content="Huy Nguyen Tuan personal website" /> 
      </Head>

      <main className="text-red-500">
        Hello
      </main>
    </div>
  )
}

export default Home
