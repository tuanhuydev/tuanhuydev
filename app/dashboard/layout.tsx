"use client";

import theme from "@lib/configs/theme";
import store from "@lib/store";
import "@lib/styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ReduxProvider store={store}>
      <ConfigProvider theme={theme}>
        <App>{children}</App>
      </ConfigProvider>
    </ReduxProvider>
  );
}
