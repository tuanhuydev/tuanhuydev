import styles from "./template.module.css";
import Sidebar from "@resources/components/features/Dashboard/Sidebar";
import { SidebarProvider } from "@resources/components/features/Dashboard/SidebarContext";
import { PropsWithChildren } from "react";

export default function DashboardTemplate({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className={styles.shell}>
        <div className={styles.inner}>
          <Sidebar />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
