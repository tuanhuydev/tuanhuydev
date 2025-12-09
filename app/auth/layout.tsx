import GlobalProvider from "@app/components/commons/providers/GlobalProvider";
import { Toaster } from "@app/components/ui/toaster";
import { Viewport } from "next";
import dynamic from "next/dynamic";
import { PropsWithChildren, Suspense } from "react";

const ThemeProvider = dynamic(() => import("@app/components/commons/providers/ThemeProvider"));

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function SignInLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <GlobalProvider>
          {children}
          <Toaster />
        </GlobalProvider>
      </ThemeProvider>
    </Suspense>
  );
}
