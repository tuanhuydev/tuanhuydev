import StyledComponentsRegistry from "@app/_components/commons/hocs/AntdRegistry";
import theme from "@lib/configs/theme";
import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
});
const NextThemeProvider = dynamic(() => import("next-themes").then((module) => module.ThemeProvider), { ssr: false });

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light">
      <StyledComponentsRegistry>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </StyledComponentsRegistry>
    </NextThemeProvider>
  );
}
