"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface UseThemeReturn {
  darkMode: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useTheme = (): UseThemeReturn => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const darkMode = mounted ? resolvedTheme === "dark" : false;

  return {
    darkMode,
    isLoading: !mounted,
    toggleTheme: () => setTheme(darkMode ? "light" : "dark"),
    setTheme,
  };
};
