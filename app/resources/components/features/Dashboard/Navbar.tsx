"use client";

import styles from "./Navbar.module.css";
import { useSidebar } from "./SidebarContext";
import AuthApiService from "@features/Auth/services/AuthApiService";
import { Button } from "@resources/components/common/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@resources/components/common/Popover";
import { ThemeToggle } from "@resources/components/common/ThemeToggle";
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
      .then((r) => (r.ok ? (r.json() as Promise<{ data?: { name?: string; email?: string } }>) : null))
      .then((json) => {
        if (json?.data) setCurrentUser(json.data);
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

  const renderStart =
    startComponent ??
    (title ? (
      <div className={styles.start}>
        <div className={styles.mobileMenuButton}>
          <Button size="icon" variant="ghost" aria-label="Toggle mobile menu" onClick={toggleMobile}>
            <Menu className={styles.icon} />
          </Button>
        </div>
        {goBack && (
          <Button size="icon" variant="ghost" aria-label="Go back" onClick={handleGoBack}>
            <ChevronLeft className={styles.icon} />
          </Button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
    ) : (
      <Fragment />
    ));

  const renderEnd = endComponent ?? (
    <Fragment>
      <ThemeToggle size="sm" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className={styles.icon} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={styles.popoverContent}>
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>
              <User className={styles.icon} />
            </div>
            <div>
              <p className={styles.userName}>{currentUser?.name ?? "User"}</p>
              <p className={styles.userEmail}>{currentUser?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className={styles.signOutButton} onClick={signOut}>
            <LogOut className={styles.iconSm} />
            Sign out
          </Button>
        </PopoverContent>
      </Popover>
    </Fragment>
  );

  return (
    <div className={styles.bar}>
      {renderStart}
      <div className={styles.end}>{renderEnd}</div>
    </div>
  );
};

export default memo(Navbar);
