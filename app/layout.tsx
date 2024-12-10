import { sourceCodeFont } from "./font";
import "@app/styles/globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Viewport } from "next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const Transition = dynamic(() => import("@app/components/commons/Transition"), { ssr: false });
const ThemeProvider = dynamic(() => import("@app/components/commons/providers/ThemeProvider"));
const QueryProvider = dynamic(() => import("@app/components/commons/providers/QueryProvider"), { ssr: false });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1314205932976713"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <Transition>{children}</Transition>
          </QueryProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
