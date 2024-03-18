import BaseButton from "./buttons/BaseButton";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { useTheme } from "next-themes";
import React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <BaseButton
      aria-label="Theme Toggle"
      variants="text"
      icon={
        theme === "dark" ? (
          <DarkModeOutlined className=" !text-slate-50 !fill-slate-50" />
        ) : (
          <LightModeOutlined className=" !text-primary !fill-primary" />
        )
      }
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}></BaseButton>
  );
}
