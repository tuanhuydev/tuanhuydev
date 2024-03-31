"use client";

import Sidebar from "@app/_components/DashboardModule/Sidebar";
import WithTransition from "@app/_components/commons/hocs/WithTransition";
import { useCurrentUserResources } from "@app/queries/resourceQueries";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { data: queryResources = [] } = useCurrentUserResources();
  const userResources = new Set((queryResources as Array<any>).map(({ name }) => name));

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center flex-nowrap">
      <div className="flex self-stretch w-full relative">
        <Sidebar resources={userResources} />
        <WithTransition className="grow flex flex-col z-2">{children}</WithTransition>
      </div>
    </div>
  );
}
