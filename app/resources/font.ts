import localFont from "next/font/local";

export const sourceCodeFont = localFont({
  src: [
    {
      path: "./fonts/momo-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/momo-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/momo-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/momo-semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/momo-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-momo",
  display: "swap",
  fallback: ["system-ui", "arial", "sans-serif"],
  preload: true,
});
