"use client";

import { Button } from "@resources/components/common/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@resources/components/common/Popover";
import { ThemeToggle } from "@resources/components/common/ThemeToggle";
import { useSignOut } from "@resources/queries/authQueries";
import { QUERY_KEYS } from "@resources/queries/queryKeys";
import { useCurrentUser } from "@resources/queries/userQueries";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Menu, LogOut, User } from "lucide-react";
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

  // State - removed anchorEl and popoverOpen states as they're handled by Popover component

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
            <Button size="icon" variant="ghost" aria-label="Toggle mobile menu" onClick={toggleMobileHamburger}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {goBack && (
            <Button size="icon" variant="ghost" aria-label="Go back button" onClick={handleGoback}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="my-auto text-2xl font-bold capitalize grow truncate">{title}</h1>
        </div>
      );
    return <Fragment />;
  }, [goBack, handleGoback, startComponent, title, toggleMobileHamburger]);

  const renderEnd = useMemo(() => {
    if (endComponent) return endComponent;
    return (
      <Fragment>
        <ThemeToggle size="sm" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-base text-gray-900 dark:text-gray-100 m-0">{name || "User"}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs m-0">{email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left text-xs justify-start hover:text-red-600 dark:hover:text-red-400"
              onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </PopoverContent>
        </Popover>
      </Fragment>
    );
  }, [endComponent, name, email, signOut]);

  return (
    <div className="pt-2 py-3 text-primary dark:text-slate-50 flex item-center justify-between relative">
      {renderStart}
      <div className="flex gap-1 items-center">{renderEnd}</div>
    </div>
  );
};

export default memo(Navbar);
