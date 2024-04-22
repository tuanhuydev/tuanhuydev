"use client";

import Sidebar from "@app/_components/DashboardModule/Sidebar";
import WithTransition from "@app/_components/commons/hocs/WithTransition";
import { useCurrentUserPermission } from "@app/queries/permissionQueries";
import { Fragment, PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { data: permissions } = useCurrentUserPermission();
  if (!permissions) return <Fragment />;
  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center flex-nowrap">
      <div className="flex self-stretch w-full relative">
        <Sidebar permissions={permissions} />
        <WithTransition className="grow flex flex-col z-2">{children}</WithTransition>
      </div>
    </div>
  );
}
