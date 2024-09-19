"use client";

import Sidebar from "@app/components/DashboardModule/Sidebar";
import WithTransition from "@app/components/commons/hocs/WithTransition";
import { useMobileSidebar } from "@app/queries/metaQueries";
import { useCurrentUserPermission } from "@app/queries/permissionQueries";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { data: showMobileHamburger } = useMobileSidebar();
  const { data: permissions = [] } = useCurrentUserPermission();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
        <div className="flex w-full relative">
          <Sidebar permissions={permissions} openMobile={showMobileHamburger} />
          <WithTransition className="flex grow flex-col z-2">{children}</WithTransition>
        </div>
      </div>
    </LocalizationProvider>
  );
}
