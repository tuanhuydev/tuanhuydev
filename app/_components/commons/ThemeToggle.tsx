import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import Button from "antd/es/button";
import { useTheme } from "next-themes";
import React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      type="text"
      aria-label="Theme Toggle"
      icon={
        theme === "dark" ? (
          <DarkModeOutlined className=" !text-slate-50 !fill-slate-50" />
        ) : (
          <LightModeOutlined className=" !text-primary !fill-primary" />
        )
      }
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}></Button>
  );
}
