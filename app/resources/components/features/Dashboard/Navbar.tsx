"use client";

import { Button } from "@resources/components/common/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@resources/components/common/Popover";
import { ThemeToggle } from "@resources/components/common/ThemeToggle";
import { useSidebar } from "./SidebarContext";
import AuthApiService from "@features/Auth/services/AuthApiService";
import { BASE_URL } from "lib/commons/constants/base";
import { ChevronLeft, Menu, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, PropsWithChildren, ReactNode, memo, useCallback, useEffect, useState } from "react";

interface NavbarProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
  goBackLink?: string;
  startComponent?: ReactNode;
  endComponent?: ReactNode;
}

const Navbar = ({ title, goBack = false, goBackLink, startComponent, endComponent }: NavbarProps) => {
  const router = useRouter();
  const { toggleMobile } = useSidebar();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(`${BASE_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.data) setCurrentUser(json.data as { name?: string; email?: string });
      })
      .catch(() => {});
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AuthApiService.signOut();
    } finally {
      localStorage.removeItem("accessToken");
      router.replace("/auth/sign-in");
    }
  }, [router]);

  const handleGoBack = useCallback(() => {
    if (goBackLink) router.push(goBackLink);
    else if (goBack) router.back();
  }, [goBack, goBackLink, router]);

  const renderStart = startComponent ?? (
    title ? (
      <div className="flex items-center gap-1 grow max-sm:max-w-xs max-lg:max-w-sm max-xl:max-w-xl text-primary dark:text-slate-50">
        <div className="block lg:hidden">
          <Button size="icon" variant="ghost" aria-label="Toggle mobile menu" onClick={toggleMobile}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {goBack && (
          <Button size="icon" variant="ghost" aria-label="Go back" onClick={handleGoBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="my-auto text-2xl font-bold capitalize grow truncate">{title}</h1>
      </div>
    ) : <Fragment />
  );

  const renderEnd = endComponent ?? (
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
              <p className="font-semibold text-base text-gray-900 dark:text-gray-100 m-0">
                {currentUser?.name ?? "User"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs m-0">{currentUser?.email}</p>
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

  return (
    <div className="pt-2 py-3 text-primary dark:text-slate-50 flex items-center justify-between relative">
      {renderStart}
      <div className="flex gap-1 items-center">{renderEnd}</div>
    </div>
  );
};

export default memo(Navbar);
