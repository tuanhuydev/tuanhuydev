"use client";

import Sidebar from "@app/_components/DashboardModule/Sidebar";
import WithTransition from "@app/_components/commons/hocs/WithTransition";
import { useMobileSidebar } from "@app/queries/metaQueries";
import { useCurrentUserPermission } from "@app/queries/permissionQueries";
import { Fragment, PropsWithChildren, useState } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { data: showMobileHamburger } = useMobileSidebar();
  const { data: permissions } = useCurrentUserPermission();

  if (!permissions) return <Fragment />;

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
      <div className="flex w-full relative">
        <Sidebar permissions={permissions} openMobile={showMobileHamburger} />
        <WithTransition className={`flex grow flex-col z-2`}>{children}</WithTransition>
      </div>
    </div>
  );
}
