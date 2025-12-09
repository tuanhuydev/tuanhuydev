import { Toaster } from "@resources/components/common/Toaster";
import GlobalProvider from "@resources/components/common/providers/GlobalProvider";
import { Viewport } from "next";
import dynamic from "next/dynamic";
import { PropsWithChildren, Suspense } from "react";

const ThemeProvider = dynamic(() => import("@resources/components/common/providers/ThemeProvider"));

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
