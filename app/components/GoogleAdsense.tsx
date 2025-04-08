import { GOOGLE_ADSENSE } from "@lib/shared/commons/constants/base";
import Script from "next/script";

export default async function GoogleAdsense() {
  return (
    <Script
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${GOOGLE_ADSENSE}`}
      crossOrigin="anonymous"
    />
  );
}
