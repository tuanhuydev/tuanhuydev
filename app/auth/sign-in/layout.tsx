"use client";

import theme from "@lib/configs/theme";
import store from "@lib/store";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";

const Loader = dynamic(async () => await import("@lib/components/commons/Loader"));

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function SignInLayout({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={theme}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ConfigProvider>
  );
}
