"use client";

import styles from "./styles.module.scss";
import logoSrc from "@lib/assets/images/logo.svg";
import Loader from "@lib/components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { currentUserSelector } from "@lib/store/slices/authSlice";
import { metaAction } from "@lib/store/slices/metaSlice";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const GridViewOutlined = dynamic(async () => (await import("@mui/icons-material/GridViewOutlined")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const ArticleOutlined = dynamic(async () => (await import("@mui/icons-material/ArticleOutlined")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const HomeOutlined = dynamic(async () => (await import("@mui/icons-material/HomeOutlined")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const ArrowCircleRightOutlined = dynamic(
  async () => (await import("@mui/icons-material/ArrowCircleRightOutlined")).default,
  {
    ssr: false,
    loading: () => <Loader />,
  },
);
const PersonOutlineOutlined = dynamic(async () => (await import("@mui/icons-material/PersonOutlineOutlined")).default, {
  ssr: false,
  loading: () => <Loader />,
});

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
    const routes: Array<any> = [
      { label: "Home", icon: <HomeOutlined className="!text-base" />, path: "/dashboard/home" },
    ];
    resources.forEach((resource: any) => {
      switch (resource.name) {
        case Permissions.VIEW_POSTS:
          routes.push({ label: "Posts", icon: <ArticleOutlined className="!text-base" />, path: "/dashboard/posts" });
          break;
        case Permissions.VIEW_PROJECTS:
          routes.push({
            label: "Projects",
            icon: <GridViewOutlined className="!text-base" />,
            path: "/dashboard/projects",
          });
          break;
        case Permissions.VIEW_USERS:
          routes.push({
            label: "Users",
            icon: <PersonOutlineOutlined className="!text-base" />,
            path: "/dashboard/users",
          });
          break;
      }
    });
    return routes.map((route: any) => {
      const { children = [] } = route;
      return children?.length ? <Group {...route} key={route.label} /> : <Item {...route} key={route.label} />;
    });
  }, [resources]);

  const containerToggleStyles = sidebarOpen ? styles.open : EMPTY_STRING;

  return (
    <div className="relative p-2">
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
        className={`${styles.container} ${containerToggleStyles} ease-in duration-150 bg-white h-full overflow-x-hidden list-none p-0 m-0`}>
        {renderRoutes}
      </ul>
    </div>
  );
};

export default Sidebar;
