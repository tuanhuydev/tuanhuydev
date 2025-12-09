"use client";

import { ItemProps } from "./Item";
import { Button } from "@resources/components/common/Button";
import { useMobileSidebar } from "@resources/queries/metaQueries";
import { QUERY_KEYS } from "@resources/queries/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { UserPermissions } from "lib/commons/constants/permissions";
import { CircleArrowRight, FileText, LayoutGrid, Home, User, Settings, Layers } from "lucide-react";
import { FC, lazy, ReactNode, useCallback, useEffect, useState } from "react";

// Replace dynamic imports with React lazy
const Group = lazy(() => import("./Group"));
const Item = lazy(() => import("./Item"));

const LargeScreenSize: number = 924;

export interface SidebarProps {
  permissions: Record<string, any>[];
}

const permissionMap = {
  [UserPermissions.VIEW_PROJECT]: {
    label: "Manage Projects",
    icon: <LayoutGrid className="w-4 h-4" />,
    path: "/dashboard/projects",
    id: UserPermissions.VIEW_PROJECT,
  },
  [UserPermissions.VIEW_POST]: {
    label: "Manage Posts",
    icon: <FileText className="w-4 h-4" />,
    path: "/dashboard/posts",
    id: UserPermissions.VIEW_POST,
  },
  [UserPermissions.VIEW_USER]: {
    label: "Manage Users",
    icon: <User className="w-4 h-4" />,
    path: "/dashboard/users",
    id: UserPermissions.VIEW_USER,
  },
  [UserPermissions.VIEW_SETTING]: {
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    path: "/dashboard/settings",
    id: UserPermissions.VIEW_SETTING,
  },
};

const makeRoutes = (permissions: Record<string, any>[]): ReactNode[] => {
  const routes: Array<ItemProps> = [
    {
      label: "Home",
      icon: <Home className="w-4 h-4" />,
      path: "/dashboard/home",
      id: "Home",
    },
    {
      label: "Apps",
      icon: <Layers className="w-4 h-4" />,
      path: "/dashboard/apps",
      id: "Apps",
    },
  ];

  permissions.forEach((permission) => {
    Object.keys(permission).forEach((key) => {
      if (Object.keys(permissionMap).includes(key)) {
        routes.push(permissionMap[key]);
      }
    });
  });

  return routes.map((route: any) => {
    const { children = [] } = route;
    return children?.length ? <Group {...route} key={route.id} /> : <Item {...route} key={route.id} />;
  });
};

const Sidebar: FC<SidebarProps> = ({ permissions = [] }) => {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { data: openMobile } = useMobileSidebar();

  useEffect(() => {
    const isMobile = window.innerWidth < LargeScreenSize;
    if (isMobile) {
      queryClient.setQueryData([QUERY_KEYS.SHOW_MOBILE_HAMBURGER], isMobile);
      setSidebarOpen(isMobile);
    }
  }, [queryClient]);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < LargeScreenSize) {
      queryClient.setQueryData([QUERY_KEYS.SHOW_MOBILE_HAMBURGER], !openMobile);
      setSidebarOpen(true);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  }, [openMobile, queryClient, sidebarOpen]);

  return (
    <div
      className={`${
        !openMobile ? "translate-x-0" : "-translate-x-[14rem]"
      } lg:translate-x-0 fixed h-full lg:relative p-2 flex flex-col z-10 border-0 dark:border-r dark:border-solid drop-shadow-md bg-slate-50 dark:bg-slate-800 dark:border-slate-800 transition-transform ease-in duration-300`}>
      <div className="h-14 truncate flex items-center justify-center">
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
        className="!bg-slate-50 !rounded-full dark:!bg-slate-800 text-slate-400 dark:text-slate-300 text-center absolute -right-3 top-1/2 z-[10] transition-transform duration-300"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}>
        <CircleArrowRight className={`w-4 h-4 ${sidebarOpen ? "rotate-180" : ""}`} />
      </Button>
      <ul
        className={`${
          sidebarOpen ? "w-[12.25rem]" : "w-[2.4rem]"
        } ease-in duration-150 grow overflow-x-hidden flex flex-col list-none p-0 m-0`}>
        {makeRoutes(permissions)}
      </ul>
    </div>
  );
};

export default Sidebar;
