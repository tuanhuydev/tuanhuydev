import Sidebar from "@app/components/DashboardModule/Sidebar";
import { LocalizationParser } from "@app/components/commons/hocs/LocalizationParser";
import { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <LocalizationParser>
      <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
        <div className="flex w-full relative overflow-hidden">
          <Sidebar />
          <div className="motion-safe:animate-fadeIn bg-slate-50 dark:bg-gray-950 p-3 h-full flex grow flex-col">
            {children}
          </div>
        </div>
      </div>
    </LocalizationParser>
  );
}
