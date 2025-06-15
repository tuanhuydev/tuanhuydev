"use client";

import { useEffect } from "react";

export default function ThemeScript() {
  useEffect(() => {
    // Initialize theme on page load
    const initTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    initTheme();

    // Listen for storage changes (when theme is changed in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        initTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return null; // This component doesn't render anything
}
