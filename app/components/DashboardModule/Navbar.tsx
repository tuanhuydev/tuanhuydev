"use client";

import BaseButton from "../commons/buttons/BaseButton";
import { useSignOut } from "@app/queries/authQueries";
import { useCurrentUser } from "@app/queries/userQueries";
import ExitToAppOutlined from "@mui/icons-material/ExitToAppOutlined";
import KeyboardArrowLeftOutlined from "@mui/icons-material/KeyboardArrowLeftOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import Popover from "@mui/material/Popover";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment, MouseEventHandler, PropsWithChildren, ReactNode, memo, useCallback, useMemo, useState } from "react";

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = useCallback(async () => {
    await signUserOut();
    queryClient.removeQueries();
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

  const toggleMobileHamburger = useCallback(() => {
    queryClient.setQueryData(["showMobileHamburger" as unknown as QueryKey], (prev: any) => !prev);
  }, [queryClient]);

  const renderStart = useMemo(() => {
    if (startComponent) return startComponent;
    if (title)
      return (
        <div className="flex items-center gap-1 grow max-sm:max-w-xs max-lg:max-w-sm max-xl:max-w-xl text-primary dark:text-slate-50">
          <BaseButton
            variants="text"
            className="block lg:hidden"
            icon={<MenuOutlined />}
            onClick={toggleMobileHamburger}
          />

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
  }, [goBack, router, startComponent, title, toggleMobileHamburger]);

  const popoverOpen = Boolean(anchorEl);
  const renderEnd = useMemo(() => {
    if (endComponent) return endComponent;
    return (
      <div className="relative">
        <BaseButton variants="text" onClick={handleClick} icon={<PersonOutlineOutlined fontSize="small" />} />
        <Popover
          title={name || email || "User"}
          open={popoverOpen}
          anchorEl={anchorEl}
          slotProps={{}}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          classes={{
            paper: "bg-white dark:bg-slate-950 p-3",
          }}
          onClose={handleClose}>
          <ul className="block m-0 p-0 list-none">
            <li className="mb-2 text-xs text-slate-500">{email}</li>
            <li
              className="mb-2 text-slate-500 hover:text-slate-700 text-xs cursor-pointer flex items-center"
              onClick={toggleUserMenu(true)}>
              <ExitToAppOutlined className="mr-2" fontSize="small" />
              Sign out
            </li>
          </ul>
        </Popover>
      </div>
    );
  }, [endComponent, name, email, popoverOpen, anchorEl, toggleUserMenu]);

  return (
    <div className="pt-2 py-3 text-primary dark:text-slate-50 flex item-center justify-between relative">
      {renderStart}
      <div className="flex gap-1 items-center">{renderEnd}</div>
    </div>
  );
};

export default memo(Navbar);
