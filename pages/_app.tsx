import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import WithProvider from "../components/hocs/WithProvider";
import { DEFAULT_THEME } from "../configs/contanst";
import { reflectTheme } from "../utils/dom";



function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const STORAGE_KEY = "theme-preference";

  const getThemeValue = (): string => {
    if (localStorage.getItem(STORAGE_KEY))
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : DEFAULT_THEME;
  };

  
  useEffect(() => {
    const theme = getThemeValue();
    setTheme(theme);
    reflectTheme(theme);
    // TODO: Sync theme with prefers-color-scheme
  }, [])

  useEffect(() => {

  })
  
  const context = {
    theme,
    themeKey: STORAGE_KEY,
  }

  return (
    <WithProvider context={context}>
      <Component {...pageProps} />
    </WithProvider>
  );
}

export default MyApp;
