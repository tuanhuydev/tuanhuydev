import GlobalProvider from "@app/components/commons/providers/GlobalProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Viewport } from "next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function SignInLayout({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <GlobalProvider>{children}</GlobalProvider>
    </AppRouterCacheProvider>
  );
}
