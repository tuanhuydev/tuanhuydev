import Sidebar from "@app/_components/DashboardModule/Sidebar";
import WithTransition from "@app/_components/commons/hocs/WithTransition";
import { getUserResources } from "@app/server/actions/user";
import { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const userResources = await getUserResources();
  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center flex-nowrap">
      <div className="flex self-stretch w-full relative">
        <Sidebar resources={userResources} />
        <WithTransition className="grow flex flex-col z-2">{children}</WithTransition>
      </div>
    </div>
  );
}
