import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import theme from "@lib/configs/theme";
import { StyledEngineProvider } from "@mui/material/styles";
import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
});
const NextThemeProvider = dynamic(() => import("next-themes").then((module) => module.ThemeProvider), { ssr: false });

const MuiBaseTheme = {
  palette: {
    primary: "green",
    text: "#fff",
  },
};

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light">
      <StyledEngineProvider injectFirst>
        <EmotionThemeProvider theme={MuiBaseTheme}>
          <AntdRegistry>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
          </AntdRegistry>
        </EmotionThemeProvider>
      </StyledEngineProvider>
    </NextThemeProvider>
  );
}
