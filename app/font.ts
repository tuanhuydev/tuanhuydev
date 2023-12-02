import { Source_Code_Pro, Ubuntu_Mono } from "next/font/google";

export const sourceCodeFont = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
  display: "swap",
});

export const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-ubuntu-mono",
  display: "swap",
  weight: "400",
});
