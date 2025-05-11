import Item, { ItemProps } from "./Item";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import Tooltip from "@mui/material/Tooltip";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { isPathActive } from "lib/utils/helper";
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
      className={`capitalize flex rounded-sm items-center min-w-0 py-2 px-3 mb-3 hover:bg-primary hover:text-white ${activeClass}`}>
      {icon ? <span className="mr-4">{icon}</span> : <Fragment />}
      <span className="truncate font-medium">{label}</span>
      <KeyboardArrowDownOutlined className={`text-base ml-auto font-bold ${open ? "rotate-90" : ""}`} />
    </div>
  );
  return (
    <li className="ease-in duration-200  mb-1 text-slate-600 cursor-pointer" onClick={toggleGroup}>
      {sidebarOpen ? (
        element
      ) : (
        <Tooltip title={label} placement="right">
          {element}
        </Tooltip>
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
