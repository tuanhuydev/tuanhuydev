import { AntdRegistry } from "@ant-design/nextjs-registry";
import { sourceCodeFont } from "@app/font";
import theme from "@lib/configs/theme";
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider, THEME_ID } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
});
const NextThemeProvider = dynamic(() => import("next-themes").then((module) => module.ThemeProvider), { ssr: false });

const MuiBaseTheme = createTheme({
  typography(palette) {
    return {
      fontSize: 16,
      fontFamily: sourceCodeFont.style.fontFamily,
    };
  },
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light">
      <StyledEngineProvider injectFirst>
        <MUIThemeProvider theme={{ [THEME_ID]: MuiBaseTheme }}>
          <AntdRegistry>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
          </AntdRegistry>
        </MUIThemeProvider>
      </StyledEngineProvider>
    </NextThemeProvider>
  );
}
