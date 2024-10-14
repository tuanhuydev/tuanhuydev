"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { sourceCodeFont } from "@app/font";
import theme from "@lib/configs/theme";
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider, THEME_ID } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const ConfigProvider = dynamic(async () => (await import("antd/es/config-provider")).default, {
  ssr: false,
});
const NextThemeProvider = dynamic(() => import("next-themes").then((module) => module.ThemeProvider), { ssr: false });

const MuiBaseTheme = createTheme({
  typography: {
    fontSize: 16,
    fontFamily: sourceCodeFont.style.fontFamily,
    body2: {
      fontSize: "0.875rem",
    },
  },
  zIndex: {
    drawer: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: sourceCodeFont.style.fontFamily,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.25rem",
          fontSize: "0.875rem",
          borderColor: "rgb(203, 213, 225)",
          backgroundColor: "white",
          width: "100%",
          height: "2rem",
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            backgroundColor: "rgb(226 232 240)", //slate-200
            color: "rgb(203, 213, 225)", // slate-400
            borderColor: "rgb(203, 213, 225)",
          },
          "& input::placeholder": {
            fontSize: "0.875rem",
            color: "rgb(203, 213, 225)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#172733",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(203, 213, 225)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(203, 213, 225)",
          },
        },
      },
    },
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
