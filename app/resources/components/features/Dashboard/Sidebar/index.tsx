"use client";

import { useSidebar } from "../SidebarContext";
import Item, { ItemProps } from "./Item";
import styles from "./Sidebar.module.css";
import { Button } from "@resources/components/common/Button";
import clsx from "clsx";
import { CircleArrowRight, FileText, Layers, ListTree, Tags } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";

const LargeScreenSize = 924;

const Sidebar: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { mobileOpen, toggleMobile } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= LargeScreenSize && mobileOpen) toggleMobile();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen, toggleMobile]);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < LargeScreenSize) {
      toggleMobile();
    } else {
      setSidebarOpen((p) => !p);
    }
  }, [toggleMobile]);

  const iconSize = { width: "1rem", height: "1rem" };
  const routes: ItemProps[] = [
    { label: "Posts", icon: <FileText style={iconSize} />, path: "/dashboard/posts", id: "posts" },
    { label: "Categories", icon: <ListTree style={iconSize} />, path: "/dashboard/categories", id: "categories" },
    { label: "Series", icon: <Layers style={iconSize} />, path: "/dashboard/series", id: "series" },
    { label: "Tags", icon: <Tags style={iconSize} />, path: "/dashboard/tags", id: "tags" },
  ];

  return (
    <div className={clsx(styles.sidebar, mobileOpen ? styles.open : styles.closed)}>
      <div className={styles.logoRow}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logo}>
          <path d="M2 6.3609V8.31087C2 8.42588 2.06982 8.5301 2.17816 8.57681L6.97816 10.6464C7.17655 10.7319 7.4 10.591 7.4 10.3804V8.98505C7.4 8.86756 7.32718 8.76159 7.21538 8.71641L4.46462 7.60453C4.21846 7.50503 4.21846 7.16674 4.46462 7.06724L7.21538 5.95536C7.32718 5.91017 7.4 5.80421 7.4 5.68672V4.29136C7.4 4.08075 7.17654 3.93988 6.97816 4.02541L2.17816 6.09495C2.06982 6.14166 2 6.24589 2 6.3609Z" />
          <path d="M14 10.6391V8.68913C14 8.57412 13.9302 8.4699 13.8218 8.42319L9.02184 6.35364C8.82346 6.26811 8.6 6.40898 8.6 6.61959V8.01495C8.6 8.13244 8.67282 8.23841 8.78462 8.28359L11.5354 9.39547C11.7815 9.49497 11.7815 9.83326 11.5354 9.93276L8.78462 11.0446C8.67282 11.0898 8.6 11.1958 8.6 11.3133V12.7086C8.6 12.9192 8.82346 13.0601 9.02184 12.9746L13.8218 10.905C13.9302 10.8583 14 10.7541 14 10.6391Z" />
        </svg>
      </div>

      <Button className={styles.toggleButton} variant="ghost" size="icon" onClick={toggleSidebar}>
        <CircleArrowRight className={clsx(styles.toggleIcon, sidebarOpen && styles.toggleIconOpen)} />
      </Button>

      <ul className={clsx(styles.nav, sidebarOpen ? styles.navOpen : styles.navClosed)}>
        {routes.map((route) => (
          <Item {...route} key={route.id} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
