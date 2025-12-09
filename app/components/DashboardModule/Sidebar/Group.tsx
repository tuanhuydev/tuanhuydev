import Item, { ItemProps } from "./Item";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { isPathActive } from "lib/utils/helper";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export interface GroupProps extends ItemProps {
  children: ItemProps[];
}

export default function Group({ label, icon, children }: GroupProps) {
  const sidebarOpen = false;
  const pathName = usePathname();

  const [open, setOpen] = useState<boolean>(false);

  const toggleGroup = () => setOpen((prevOpen: boolean) => !prevOpen);

  const isGroupActive = children.some(({ path }: ItemProps) => isPathActive(pathName, path));
  const activeClass = isGroupActive ? "!bg-grey-950 !text-white" : EMPTY_STRING;
  const childClass = sidebarOpen ? "ml-2 mt-2" : EMPTY_STRING;

  useEffect(() => {
    if (!sidebarOpen) setOpen(false);
  }, [sidebarOpen]);
  const element = (
    <div
      className={`capitalize flex items-center gap-2 min-w-0 py-2 px-3 mb-3 rounded-sm hover:bg-primary hover:text-white ${activeClass}`}>
      {icon ? <span className="shrink-0 min-w-4">{icon}</span> : <Fragment />}
      <span className="truncate font-medium">{label}</span>
      <ChevronDown className={`w-4 h-4 min-w-4 ml-auto shrink-0 ${open ? "rotate-90" : ""}`} />
    </div>
  );
  return (
    <li className="ease-in duration-200  mb-1 text-slate-600 dark:text-slate-300 cursor-pointer" onClick={toggleGroup}>
      {sidebarOpen ? (
        element
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{element}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {open && (
        <ul className={`list-none p-0 ${childClass}`}>
          {children.map((childRoute: ItemProps) => (
            <Item key={childRoute.path} {...childRoute} />
          ))}
        </ul>
      )}
    </li>
  );
}
