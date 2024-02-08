"use client";

import { ItemProps } from "./Item";
import styles from "./styles.module.scss";
import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import ArrowCircleRightOutlined from "@mui/icons-material/ArrowCircleRightOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import EventNoteOutlined from "@mui/icons-material/EventNoteOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import { currentUserSelector } from "@store/slices/authSlice";
import { metaAction } from "@store/slices/metaSlice";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const Group = dynamic(async () => (await import("./Group")).default, { ssr: false, loading: () => <Loader /> });
const Item = dynamic(async () => (await import("./Item")).default, { ssr: false, loading: () => <Loader /> });
const Button = dynamic(async () => (await import("antd/es/button")).default, { ssr: false, loading: () => <Loader /> });

const Sidebar = () => {
  const dispatch = useDispatch();

  const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);
  const currentUser = useSelector(currentUserSelector);
  const { resources = [] } = currentUser || {};

  const toggleSidebar = useCallback(() => dispatch(metaAction.setSidebarState(!sidebarOpen)), [dispatch, sidebarOpen]);

  const renderRoutes = useMemo(() => {
    const routes: Array<ItemProps> = [
      { label: "Home", icon: <HomeOutlined className="!text-base" />, path: "/dashboard/home", id: "Home" },
      { label: "Tasks", icon: <TaskAltOutlined className="!text-base" />, path: "/dashboard/tasks", id: "Task" },
      {
        label: "Sticky Notes",
        icon: <EventNoteOutlined className="!text-base" />,
        path: "/dashboard/notes",
        id: "Note",
      },
    ];
    resources.forEach((resource: any) => {
      switch (resource.name) {
        case Permissions.VIEW_POSTS:
          routes.push({
            label: "Manage Posts",
            icon: <ArticleOutlined className="!text-base" />,
            path: "/dashboard/posts",
            id: Permissions.VIEW_POSTS,
          });
          break;
        case Permissions.VIEW_PROJECTS:
          routes.push({
            label: "Manage Projects",
            icon: <GridViewOutlined className="!text-base" />,
            path: "/dashboard/projects",
            id: Permissions.VIEW_PROJECTS,
          });
          break;
        case Permissions.VIEW_USERS:
          routes.push({
            label: "Manage Users",
            icon: <PersonOutlineOutlined className="!text-base" />,
            path: "/dashboard/users",
            id: Permissions.VIEW_USERS,
          });
          break;
        case Permissions.VIEW_SETTINGS:
          routes.push({
            label: "Settings",
            icon: <SettingsOutlined className="!text-base" />,
            path: "/dashboard/settings",
            id: Permissions.VIEW_SETTINGS,
          });
          break;
      }
    });

    return routes.map((route: any) => {
      const { children = [] } = route;
      return children?.length ? <Group {...route} key={route.id} /> : <Item {...route} key={route.id} />;
    });
  }, [resources]);

  const containerToggleStyles = sidebarOpen ? styles.open : EMPTY_STRING;

  return (
    <div className="relative p-2 flex flex-col border-0 dark:border-r dark:border-solid dark:border-slate-800">
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
        shape="circle"
        className="!bg-slate-50 dark:!bg-primary text-slate-400 text-center !leading-none !absolute -right-4 top-1/2 z-[1] drop-shadow-sm"
        type="text"
        onClick={toggleSidebar}
        icon={
          <ArrowCircleRightOutlined
            className={`!text-lg text-primary dark:text-slate-50  ${sidebarOpen ? "rotate-180" : ""}`}
          />
        }
      />

      <ul
        className={`${styles.container} ${containerToggleStyles} ease-in duration-150  grow overflow-x-hidden flex flex-col list-none p-0 m-0`}>
        {renderRoutes}
      </ul>
    </div>
  );
};

export default Sidebar;
