"use client";

import ThemeToggle from "../commons/ThemeToggle";
import BaseButton from "../commons/buttons/BaseButton";
import { useSignOut } from "@app/queries/authQueries";
import { useCurrentUser } from "@app/queries/userQueries";
import ExitToAppOutlined from "@mui/icons-material/ExitToAppOutlined";
import KeyboardArrowLeftOutlined from "@mui/icons-material/KeyboardArrowLeftOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, PropsWithChildren, ReactNode, memo, useCallback, useMemo, useState } from "react";

const Popover = dynamic(() => import("antd/es/popover"), { ssr: false });

interface NavbarProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
  startComponent?: ReactNode;
  endComponent?: ReactNode;
}

const Navbar = ({ title, goBack = false, startComponent, endComponent }: NavbarProps) => {
  // Hook
  const router = useRouter();
  const { data: currentUser = {} } = useCurrentUser();
  const { mutateAsync: signUserOut } = useSignOut();
  const queryClient = useQueryClient();

  const { email, name } = currentUser;

  // State
  const [open, setOpenUserMenu] = useState(false);

  const signOut = useCallback(async () => {
    await signUserOut();
    localStorage.clear();
    queryClient.invalidateQueries();
    router.replace("/auth/sign-in");
  }, [queryClient, router, signUserOut]);

  const toggleUserMenu = useCallback(
    (value: boolean) => () => {
      if (!value) return setOpenUserMenu(!open);

      setOpenUserMenu(value);
      signOut();
    },
    [open, signOut],
  );

  const renderStart = useMemo(() => {
    if (startComponent) return startComponent;
    if (title)
      return (
        <div className="flex items-center gap-1 grow max-sm:max-w-xs max-lg:max-w-sm max-xl:max-w-xl text-primary dark:text-slate-50">
          {goBack && (
            <BaseButton
              variants="text"
              onClick={() => router.back()}
              icon={<KeyboardArrowLeftOutlined className="!fill-primary dark:!fill-slate-50" />}
            />
          )}
          <h1 className="my-auto text-2xl font-bold capitalize grow truncate">{title}</h1>
        </div>
      );
    return <Fragment />;
  }, [goBack, router, startComponent, title]);

  const renderEnd = useMemo(() => {
    if (endComponent) return endComponent;
    return (
      <Popover
        placement="bottom"
        title={name || email || "User"}
        content={
          <ul className="block m-0 p-0 list-none">
            <li className="mb-2 text-xs text-slate-500">{email}</li>
            <li
              className="mb-2 text-slate-500 hover:text-slate-700 cursor-pointer flex items-center"
              onClick={toggleUserMenu(true)}>
              <ExitToAppOutlined className="mr-2" fontSize="small" />
              Sign out
            </li>
          </ul>
        }
        overlayInnerStyle={{ width: "12rem" }}
        trigger="click"
        open={open}
        onOpenChange={toggleUserMenu(false)}>
        <BaseButton variants="text" icon={<PersonOutlineOutlined fontSize="small" />} />
      </Popover>
    );
  }, [endComponent, name, email, toggleUserMenu, open]);

  return (
    <div className="px-3 py-1  text-primary  dark:text-slate-50 flex item-center justify-between">
      {renderStart}
      <div className="flex gap-1 items-center">
        <ThemeToggle />
        {renderEnd}
      </div>
    </div>
  );
};

export default memo(Navbar);
