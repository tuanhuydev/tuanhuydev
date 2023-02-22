import { STORAGE_KEY, DEFAULT_THEME } from "@shared/configs/constants";

export const reflectTheme = (theme: string) => {
  const htmlElement = document.querySelector("html");
  if (htmlElement) {
    htmlElement.setAttribute("class", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }
};

export const updateLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

export const getThemeValue = (): string => {
  if (localStorage.getItem(STORAGE_KEY))
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;

  return window && window?.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : DEFAULT_THEME;
};
