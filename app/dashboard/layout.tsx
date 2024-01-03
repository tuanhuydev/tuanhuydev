"use client";

import "@lib/styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <App>{children}</App>;
}
