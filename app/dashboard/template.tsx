import Sidebar from "@resources/components/features/Dashboard/Sidebar";
import { PropsWithChildren } from "react";

export default async function DashboardTemplate({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
      <div className="flex w-full relative overflow-hidden">
        <Sidebar />
        <div className="motion-safe:animate-fadeIn bg-slate-50 dark:bg-gray-950 py-3 px-5 h-full flex grow flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
