"use client";

import { useSignOut } from "@app/_queries/authQueries";
import { QUERY_KEYS } from "@app/_queries/queryKeys";
import { useCurrentUser } from "@app/_queries/userQueries";
import ExitToAppOutlined from "@mui/icons-material/ExitToAppOutlined";
import KeyboardArrowLeftOutlined from "@mui/icons-material/KeyboardArrowLeftOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import { Button, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Fragment,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface NavbarProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
  goBackLink?: string;
  startComponent?: ReactNode;
  endComponent?: ReactNode;
}

const Navbar = ({ title, goBack = false, goBackLink, startComponent, endComponent }: NavbarProps) => {
  // Hook
  const router = useRouter();
  const { data: currentUser = {}, refetch } = useCurrentUser();
  const { mutateAsync: signUserOut } = useSignOut();
  const queryClient = useQueryClient();

  const { email, name } = currentUser;

  // State
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const signOut = useCallback(async () => {
    await signUserOut();
    queryClient.removeQueries();
    router.replace("/auth/sign-in");
  }, [queryClient, router, signUserOut]);

  const handleGoback = useCallback(() => {
    if (goBackLink) {
      router.push(goBackLink);
    } else if (goBack) {
      router.back();
    }
  }, [goBack, goBackLink, router]);

  const toggleMobileHamburger = useCallback(() => {
    queryClient.setQueryData<boolean>([QUERY_KEYS.SHOW_MOBILE_HAMBURGER], (prev) => !prev);
  }, [queryClient]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const renderStart = useMemo(() => {
    if (startComponent) return startComponent;
    if (title)
      return (
        <div className="flex items-center gap-1 grow max-sm:max-w-xs max-lg:max-w-sm max-xl:max-w-xl text-primary dark:text-slate-50">
          <div className="block lg:hidden">
            <IconButton size="small" aria-label="Toggle mobile menu" onClick={toggleMobileHamburger}>
              <MenuOutlined fontSize="small" />
            </IconButton>
          </div>

          {goBack && (
            <IconButton size="small" aria-label="Go back button" onClick={handleGoback} className="block lg:hidden">
              <KeyboardArrowLeftOutlined />
            </IconButton>
          )}
          <h1 className="my-auto text-2xl font-bold capitalize grow truncate">{title}</h1>
        </div>
      );
    return <Fragment />;
  }, [goBack, handleGoback, startComponent, title, toggleMobileHamburger]);

  const popoverOpen = Boolean(anchorEl);
  const renderEnd = useMemo(() => {
    if (endComponent) return endComponent;
    return (
      <div className="relative">
        <IconButton onClick={handleClick} size="small">
          <PersonOutlineOutlined fontSize="small" />
        </IconButton>
        <Popover
          title={name || email || "User"}
          open={popoverOpen}
          anchorEl={anchorEl}
          slotProps={{}}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          classes={{
            paper: "bg-white dark:bg-slate-950 p-3",
          }}
          onClose={handleClose}>
          <ul className="block m-0 p-0 list-none">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <PersonOutlineOutlined />
              </div>
              <div className="mb-2">
                <p className="font-semibold text-base text-gray-900 dark:text-gray-100 m-0">{name || "User"}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs m-0">{email}</p>
              </div>
            </div>
            <Button
              variant="text"
              color="inherit"
              disableRipple
              size="small"
              startIcon={<ExitToAppOutlined fontSize="small" />}
              classes={{ root: "w-full text-left text-xs justify-start hover:text-red-600 dark:hover:text-red-400" }}
              onClick={() => {
                handleClose();
                signOut();
              }}>
              Sign out
            </Button>
          </ul>
        </Popover>
      </div>
    );
  }, [endComponent, name, email, popoverOpen, anchorEl, handleClose, signOut]);

  return (
    <div className="pt-2 py-3 text-primary dark:text-slate-50 flex item-center justify-between relative">
      {renderStart}
      <div className="flex gap-1 items-center">{renderEnd}</div>
    </div>
  );
};

export default memo(Navbar);
