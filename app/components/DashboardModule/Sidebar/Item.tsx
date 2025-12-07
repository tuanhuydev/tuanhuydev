import { Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { UserPermissions } from "lib/commons/constants/permissions";
import { isPathActive } from "lib/utils/helper";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

export interface ItemProps {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export default function Item({ label, icon, path, id }: ItemProps) {
  const pathName = usePathname();
  const sidebarOpen = false;

  const activeClass = isPathActive(pathName, path)
    ? "bg-primary text-slate-50 dark:bg-slate-600"
    : "text-slate-700 dark:text-slate-300";

  const itemElement = useMemo(
    () => (
      <Link href={path} key={path} prefetch={false} className={id === UserPermissions.VIEW_SETTING ? "mt-auto" : ""}>
        <li
          className={`ease-in duration-200 font-sans rounded-sm mb-1 dark:text-slate-300  cursor-pointer py-2 px-3 hover:bg-primary hover:text-slate-50 dark:hover:bg-slate-600 dark:hover:text-slate-50 ${activeClass}`}>
          <div className="capitalize flex items-center justify-start relative min-w-0">
            {icon}
            <Typography variant="body2" sx={{ ml: 1 }} className="truncate">
              {label}
            </Typography>
          </div>
        </li>
      </Link>
    ),
    [activeClass, icon, id, label, path],
  );

  if (!sidebarOpen) return itemElement;
  return (
    <Tooltip title={label} placement="right">
      {itemElement}
    </Tooltip>
  );
}
