import Sidebar from "@app/_components/DashboardModule/Sidebar";
import Loader from "@app/_components/commons/Loader";
import "@styles/globals.scss";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});
export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <App>
      <div className="w-full h-screen overflow-hidden flex justify-center items-center flex-nowrap">
        <div className="flex self-stretch w-full relative">
          <Sidebar />
          <div className="grow flex flex-col z-2">{children}</div>
        </div>
      </div>
    </App>
  );
}
