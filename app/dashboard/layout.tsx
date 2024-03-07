"use client";

import WithTransition from "@app/_components/commons/hocs/WithTransition";
import getQueryClient from "@app/_configs/queryClient";
import Loader from "@components/commons/Loader";
import { QueryProvider } from "@components/commons/providers/QueryProvider";
import ReduxProvider from "@components/commons/providers/ReduxProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "@styles/globals.scss";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Sidebar = dynamic(async () => (await import("@app/_components/DashboardModule/Sidebar")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(getQueryClient())}>
        <ReduxProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App>
              <WithTransition>
                <div className="w-full h-screen overflow-hidden flex justify-center items-center flex-nowrap">
                  <div className="flex self-stretch w-full relative">
                    <Sidebar />
                    <div className="grow flex flex-col z-2">{children}</div>
                  </div>
                </div>
              </WithTransition>
            </App>
          </LocalizationProvider>
        </ReduxProvider>
      </HydrationBoundary>
    </QueryProvider>
  );
}
