"use client";

import { sourceCodeFont } from "./font";
import Loader from "@components/commons/Loader";
import StyledComponentsRegistry from "@components/hocs/AntdRegistry";
import theme from "@lib/configs/theme";
import store from "@store/index";
import "@styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";

const GoogleAdsense = dynamic(() => import("@components/GoogleAdsense"), { ssr: false });
const GoogleAnalytic = dynamic(() => import("@components/GoogleAnalytic"), { ssr: false });
const GoogleTag = dynamic(() => import("@components/GoogleTag"), { ssr: false });

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        {/* General */}
        <meta name="title" property="og:title" content="tuanhuydev - Fullstack Software Engineer" />
        <meta
          name="description"
          property="og:description"
          content="🚀 tuanhuydev is Huy Nguyen Tuan's personal website. He is a passionate, full-stack developer from Viet Nam ready to contribute to your business's success."
        />
        <title>tuanhuydev - Fullstack Software Engineer</title>
        <meta name="image" property="og:image" content="/assets/images/preview.png" />
        <meta name="url" property="og:url" content="https://tuanhuy.dev" />
        <meta name="type" property="og:type" content="website" />
        <meta name="site_name" property="og:site_name" content="tuanhuydev" />

        <meta name="keywords" content="#WebDevelopment, #FullStack, #React, #Next.js, #Node.js, #AWS" />
        <meta name="author" content="Huy Nguyen Tuan"></meta>
        <meta name="robots" content="all" />
        <meta name="google" content="notranslate" />
        {/* Safari Customize */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f172a" />
        <meta name="theme-color" content="#0f172a" />
        {/* Not yet supported */}
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Google Setup */}
        <GoogleAdsense />
        <GoogleTag />
        <GoogleAnalytic />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <ReduxProvider store={store}>{children}</ReduxProvider>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
