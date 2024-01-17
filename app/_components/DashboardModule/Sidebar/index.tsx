"use client";

import { ItemProps } from "./Item";
import styles from "./styles.module.scss";
import logoSrc from "@assets/images/logo.svg";
import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import ArrowCircleRightOutlined from "@mui/icons-material/ArrowCircleRightOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { currentUserSelector } from "@store/slices/authSlice";
import { metaAction } from "@store/slices/metaSlice";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const Group = dynamic(async () => (await import("./Group")).default, { ssr: false, loading: () => <Loader /> });
const Item = dynamic(async () => (await import("./Item")).default, { ssr: false, loading: () => <Loader /> });
const Button = dynamic(async () => (await import("antd/es/button")).default, { ssr: false, loading: () => <Loader /> });
const Image = dynamic(async () => (await import("next/image")).default, { ssr: false, loading: () => <Loader /> });

const Sidebar = () => {
  const dispatch = useDispatch();

  const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);
  const currentUser = useSelector(currentUserSelector);
  const { resources = [] } = currentUser || {};

  const toggleSidebar = useCallback(() => dispatch(metaAction.setSidebarState(!sidebarOpen)), [dispatch, sidebarOpen]);

  const renderRoutes = useMemo(() => {
    const routes: Array<ItemProps> = [
      { label: "Home", icon: <HomeOutlined className="!text-base" />, path: "/dashboard/home", id: "Home" },
    ];
    resources.forEach((resource: any) => {
      switch (resource.name) {
        case Permissions.VIEW_POSTS:
          routes.push({
            label: "Posts",
            icon: <ArticleOutlined className="!text-base" />,
            path: "/dashboard/posts",
            id: Permissions.VIEW_POSTS,
          });
          break;
        case Permissions.VIEW_PROJECTS:
          routes.push({
            label: "Projects",
            icon: <GridViewOutlined className="!text-base" />,
            path: "/dashboard/projects",
            id: Permissions.VIEW_PROJECTS,
          });
          break;

        case Permissions.VIEW_USERS:
          routes.push({
            label: "Users",
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
    <div className="relative p-2 flex flex-col">
      <div className="h-14 bg-white truncate flex items-center justify-center">
        <Image src={logoSrc} width={32} blurDataURL={logoSrc} height={32} alt="page logo" />
      </div>
      <Button
        shape="circle"
        className="!bg-white text-slate-400 text-center !leading-none !absolute -right-4 top-1/2 z-[1] drop-shadow-sm"
        type="text"
        onClick={toggleSidebar}
        icon={<ArrowCircleRightOutlined className={`!text-lg ${sidebarOpen ? "rotate-180" : ""}`} />}
      />
      <ul
        className={`${styles.container} ${containerToggleStyles} ease-in duration-150 bg-white grow overflow-x-hidden flex flex-col list-none p-0 m-0`}>
        {renderRoutes}
      </ul>
    </div>
  );
};

export default Sidebar;
