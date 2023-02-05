import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
    <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
}
