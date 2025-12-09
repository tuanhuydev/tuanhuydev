"use client";

import { useCallback, useEffect, useState } from "react";

export interface ThemeState {
  darkMode: boolean;
  isLoading: boolean;
}

export interface UseThemeReturn extends ThemeState {
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useTheme = (): UseThemeReturn => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initializeTheme = useCallback(() => {
    try {
      if (typeof window === "undefined") return;

      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      const shouldUseDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

      setDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark", shouldUseDark);
      setIsLoading(false);
    } catch (error) {
      console.warn("Theme initialization failed:", error);
      setIsLoading(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  }, [darkMode]);

  const setTheme = useCallback((theme: "light" | "dark" | "system") => {
    let shouldUseDark = false;

    if (theme === "dark") {
      shouldUseDark = true;
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      shouldUseDark = false;
      localStorage.setItem("theme", "light");
    } else {
      // system theme
      localStorage.removeItem("theme");
      shouldUseDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        // Only update if user hasn't set a preference
        setDarkMode(mediaQuery.matches);
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return {
    darkMode,
    isLoading,
    toggleTheme,
    setTheme,
  };
};
