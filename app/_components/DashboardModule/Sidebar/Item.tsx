import { RootState } from "@lib/configs/types";
import { UserPermissions } from "@lib/shared/commons/constants/permissions";
import { isPathActive } from "@lib/shared/utils/helper";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";

export interface ItemProps {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
}

const Tooltip = dynamic(async () => (await import("antd/es/tooltip")).default, { ssr: false });

export default function Item({ label, icon, path, id }: ItemProps) {
  const pathName = usePathname();
  const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);

  const activeClass = isPathActive(pathName, path)
    ? "bg-primary text-slate-50 dark:text-slate-50 dark:bg-slate-800"
    : "text-slate-700";

  const itemElement = useMemo(
    () => (
      <Link href={path} key={path} prefetch={false} className={id === UserPermissions.VIEW_SETTINGS ? "mt-auto" : ""}>
        <li
          className={`ease-in duration-200 rounded-sm mb-1 dark:text-slate-300  cursor-pointer py-2 px-3 hover:bg-primary hover:text-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${activeClass}`}>
          <div className="capitalize flex items-center relative min-w-0">
            <span className="mr-3 leading-none align-middle">{icon}</span>
            <span className="truncate">{label}</span>
          </div>
        </li>
      </Link>
    ),
    [activeClass, icon, id, label, path],
  );

  if (sidebarOpen) return itemElement;
  return (
    <Tooltip title={label} placement="right">
      {itemElement}
    </Tooltip>
  );
}
