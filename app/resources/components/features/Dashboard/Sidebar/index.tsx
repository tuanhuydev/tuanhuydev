"use client";

import Group, { GroupProps } from "./Group";
import Item, { ItemProps } from "./Item";
import { Button } from "@resources/components/common/Button";
import { useMobileSidebar } from "@resources/queries/metaQueries";
import { QUERY_KEYS } from "@resources/queries/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { UserPermissions } from "lib/commons/constants/permissions";
import { CircleArrowRight, FileText, Home, Settings } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";

const LargeScreenSize: number = 924;

export interface SidebarProps {
  permissions: string[];
}

const Sidebar: FC<SidebarProps> = () => {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // Default to open on desktop
  const { data: openMobile } = useMobileSidebar();

  // Handle Resize Events
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < LargeScreenSize;
      // If switching to desktop, ensure mobile menu state is cleared
      if (!isMobile) {
        queryClient.setQueryData([QUERY_KEYS.SHOW_MOBILE_HAMBURGER], false);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [queryClient]);

  const toggleSidebar = useCallback(() => {
    const isMobile = window.innerWidth < LargeScreenSize;

    if (isMobile) {
      queryClient.setQueryData([QUERY_KEYS.SHOW_MOBILE_HAMBURGER], !openMobile);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  }, [openMobile, queryClient]);

  const routes: Array<ItemProps> = [
    {
      label: "Home",
      icon: <Home className="h-4 w-4" />,
      path: "/dashboard/home",
      id: "Home",
    },
  ];

  const permissionMap = {
    // [UserPermissions.VIEW_PROJECT]: {
    //   label: "Manage Projects",
    //   icon: <LayoutGrid className="h-4 w-4" />,
    //   path: "/dashboard/projects",
    //   id: UserPermissions.VIEW_PROJECT,
    // },
    [UserPermissions.VIEW_POST]: {
      label: "Manage Posts",
      icon: <FileText className="h-4 w-4" />,
      path: "/dashboard/posts",
      id: UserPermissions.VIEW_POST,
    },
    // [UserPermissions.VIEW_USER]: {
    //   label: "Manage Users",
    //   icon: <User className="h-4 w-4" />,
    //   path: "/dashboard/users",
    //   id: UserPermissions.VIEW_USER,
    // },
    [UserPermissions.VIEW_SETTING]: {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      path: "/dashboard/settings",
      id: UserPermissions.VIEW_SETTING,
    },
  };

  Object.values(permissionMap).forEach((key) => {
    routes.push(key);
  });

  return (
    <div
      className={`${
        !openMobile ? "-translate-x-[110%] lg:translate-x-0" : "translate-x-0"
      } fixed z-10 flex h-full flex-col border-0 bg-slate-50 p-2 drop-shadow-md transition-transform duration-300 ease-in dark:border-r dark:border-solid dark:border-slate-800 dark:bg-slate-800 lg:relative`}>
      <div className="flex h-14 items-center justify-center truncate">
        {/* SVG Logo */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-primary dark:stroke-slate-50">
          <path d="M2 6.3609V8.31087C2 8.42588 2.06982 8.5301 2.17816 8.57681L6.97816 10.6464C7.17655 10.7319 7.4 10.591 7.4 10.3804V8.98505C7.4 8.86756 7.32718 8.76159 7.21538 8.71641L4.46462 7.60453C4.21846 7.50503 4.21846 7.16674 4.46462 7.06724L7.21538 5.95536C7.32718 5.91017 7.4 5.80421 7.4 5.68672V4.29136C7.4 4.08075 7.17654 3.93988 6.97816 4.02541L2.17816 6.09495C2.06982 6.14166 2 6.24589 2 6.3609Z" />
          <path d="M14 10.6391V8.68913C14 8.57412 13.9302 8.4699 13.8218 8.42319L9.02184 6.35364C8.82346 6.26811 8.6 6.40898 8.6 6.61959V8.01495C8.6 8.13244 8.67282 8.23841 8.78462 8.28359L11.5354 9.39547C11.7815 9.49497 11.7815 9.83326 11.5354 9.93276L8.78462 11.0446C8.67282 11.0898 8.6 11.1958 8.6 11.3133V12.7086C8.6 12.9192 8.82346 13.0601 9.02184 12.9746L13.8218 10.905C13.9302 10.8583 14 10.7541 14 10.6391Z" />
        </svg>
      </div>

      <Button
        className="absolute -right-3 top-1/2 z-[10] !rounded-full !bg-slate-50 text-center text-slate-400 transition-transform duration-300 dark:!bg-slate-800 dark:text-slate-300 shadow-md border border-slate-200 dark:border-slate-700"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}>
        <CircleArrowRight className={`h-4 w-4 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
      </Button>

      <ul
        className={`${
          sidebarOpen ? "w-[12.25rem]" : "w-[2.4rem]"
        } m-0 flex grow list-none flex-col overflow-x-hidden p-0 duration-150 ease-in`}>
        {routes.map((route) => {
          const isGroup = "children" in route && Array.isArray(route.children) && route.children.length > 0;
          return isGroup ? <Group {...(route as GroupProps)} key={route.id} /> : <Item {...route} key={route.id} />;
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
