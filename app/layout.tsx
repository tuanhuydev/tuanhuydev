"use client";

import { sourceCodeFont } from "./font";
import Loader from "@components/commons/Loader";
import StyledComponentsRegistry from "@components/hocs/AntdRegistry";
import { GOOGLE_TAG, NODE_ENV } from "@lib/configs/constants";
import theme from "@lib/configs/theme";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import store from "@store/index";
import "@styles/globals.scss";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";

const ThemeProvider = dynamic(() => import("next-themes").then((module) => module.ThemeProvider), { ssr: false });
const GoogleAdsense = dynamic(() => import("@components/GoogleAdsense"), { ssr: false });

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        <GoogleAdsense />
        {NODE_ENV === "production" && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
        {NODE_ENV === "production" && GOOGLE_TAG && <GoogleAnalytics gaId={GOOGLE_TAG} />}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StyledComponentsRegistry>
            <ConfigProvider theme={theme}>
              <ReduxProvider store={store}>{children}</ReduxProvider>
            </ConfigProvider>
          </StyledComponentsRegistry>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
