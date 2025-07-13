import Sidebar from "@app/components/DashboardModule/Sidebar";
import { userPermissionAction } from "@server/actions/authActions";
import { PropsWithChildren } from "react";

interface DashboardTemplateProps extends PropsWithChildren {}

export default async function DashboardTemplate({ children }: DashboardTemplateProps) {
  const userPermission: Record<string, any>[] = await userPermissionAction();

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
      <div className="flex w-full relative overflow-hidden">
        <Sidebar permissions={userPermission} />
        <div className="motion-safe:animate-fadeIn bg-slate-50 dark:bg-gray-950 py-3 px-5 h-full flex grow flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
