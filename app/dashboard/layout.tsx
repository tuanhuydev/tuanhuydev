"use client";

import getQueryClient from "@app/_configs/queryClient";
import Loader from "@components/commons/Loader";
import { QueryProvider } from "@components/commons/providers/QueryProvider";
import "@styles/globals.scss";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(getQueryClient())}>
        <App>{children}</App>
      </HydrationBoundary>
    </QueryProvider>
  );
}
