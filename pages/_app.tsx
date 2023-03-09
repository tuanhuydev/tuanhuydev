import "@frontend/styles/globals.css";
import type { AppProps } from "next/app";
import WithProvider from "@frontend/components/hocs/WithProvider";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WithProvider context={{ theme: "light", playSound: true }}>
      {/* Google Adsense */}
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1314205932976713"
        crossOrigin="anonymous"
      ></Script>
      {/* Google Tag Management */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-GW4RS8JCYT"
      ></Script>
      {/* Google Analytic */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GW4RS8JCYT');`,
        }}
      />
      <Component {...pageProps} />
    </WithProvider>
  );
}

export default MyApp;
