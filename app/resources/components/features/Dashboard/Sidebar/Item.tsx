import styles from "./Item.module.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@resources/components/common/Tooltip";
import clsx from "clsx";
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

  const isActive = isPathActive(pathName, path);

  const itemElement = useMemo(
    () => (
      <Link href={path} key={path} prefetch={false} className={id === "settings" ? styles.settingsLink : ""}>
        <li className={clsx(styles.item, isActive && styles.active)}>
          <div className={styles.row}>
            <span className={styles.iconSlot}>{icon}</span>
            <span className={styles.label}>{label}</span>
          </div>
        </li>
      </Link>
    ),
    [isActive, icon, id, label, path],
  );

  if (!sidebarOpen) return itemElement;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{itemElement}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
