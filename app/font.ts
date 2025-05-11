import { Be_Vietnam_Pro } from "next/font/google";

export const sourceCodeFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap", // Ensures text remains visible during font loading
  fallback: ["system-ui", "arial", "sans-serif"], // Fallback fonts
  preload: true,
  adjustFontFallback: true, // Use font metrics to avoid layout shifts
});
