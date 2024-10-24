import { DEFAULT_THEME, STORAGE_THEME_KEY } from "@lib/configs/constants";

export const reflectTheme = (theme: string) => {
  const htmlElement = document.querySelector("html");
  if (htmlElement) {
    htmlElement.setAttribute("class", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }
};

export const reflectSound = (playSound: boolean) => {
  const audioEl = document.getElementById("audio") as HTMLAudioElement;
  audioEl.muted = !playSound;
};

export const setLocalStorage = (key: string, value: any) => {
  const hasKey = localStorage.getItem(key);
  if (hasKey) localStorage.removeItem(key);
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key: string) => {
  const rawStorage: string | null = localStorage.getItem(key);

  try {
    if (!rawStorage) throw Error("Not found");
    return JSON.parse(rawStorage) ?? rawStorage;
  } catch (error) {
    return rawStorage;
  }
};

export const clearLocalStorage = () => {
  return localStorage.clear();
};

export const getThemeValue = (): string => {
  if (localStorage.getItem(STORAGE_THEME_KEY)) return localStorage.getItem(STORAGE_THEME_KEY) || DEFAULT_THEME;

  return window && window?.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME;
};
