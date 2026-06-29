import { Toaster } from "@resources/components/common/Toaster";
import GlobalProvider from "@resources/components/common/providers/GlobalProvider";
import { Viewport } from "next";
import { PropsWithChildren, Suspense } from "react";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function SignInLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalProvider>
        {children}
        <Toaster />
      </GlobalProvider>
    </Suspense>
  );
}
