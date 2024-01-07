"use client";

import "@styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const Loader = dynamic(() => import("@components/commons/Loader"), { ssr: false });

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <App>{children}</App>;
}
