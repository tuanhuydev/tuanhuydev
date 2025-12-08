import localFont from "next/font/local";

export const sourceCodeFont = localFont({
  src: [
    {
      path: "../public/fonts/momo-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/momo-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/momo-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/momo-semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/momo-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-momo",
  display: "swap",
  fallback: ["system-ui", "arial", "sans-serif"],
  preload: true,
});
