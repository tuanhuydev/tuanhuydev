import { GOOGLE_TAG, NODE_ENV } from "@lib/configs/constants";
import Script from "next/script";
import React from "react";

export default function GoogleAnalytic() {
  const shouldAttach = NODE_ENV === "production" && GOOGLE_TAG;
  return (
    <>
      {shouldAttach && (
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG}');`,
          }}
        />
      )}
    </>
  );
}
