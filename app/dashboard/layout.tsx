"use client";

import { useMobileSidebar } from "@app/queries/metaQueries";
import { useCurrentUserPermission } from "@app/queries/permissionQueries";
import { useFetch } from "@app/queries/useSession";
import Sidebar from "@components/DashboardModule/Sidebar";
import WithTransition from "@components/commons/hocs/WithTransition";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { data: showMobileHamburger } = useMobileSidebar();
  const { data: permissions = [], isFetching, isError, isFetched } = useCurrentUserPermission();
  const { signOut } = useFetch();
  const hasPermissions = !!permissions.length;

  // useEffect(() => {
  //   if ((isFetched && !hasPermissions) || isError) signOut();
  // }, [isError, isFetched, hasPermissions, signOut]);

  // if (isFetching || !hasPermissions) return <Loader />;

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
      <div className="flex w-full relative">
        <Sidebar permissions={permissions} openMobile={showMobileHamburger} />
        <WithTransition className={`flex grow flex-col z-2`}>{children}</WithTransition>
      </div>
    </div>
  );
}
