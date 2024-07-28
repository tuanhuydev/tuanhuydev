import { Source_Sans_3 } from "next/font/google";

export const sourceCodeFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-code",
  display: "swap",
});
