"use client";

import Loader from "@components/commons/Loader";
import { RootState } from "@lib/configs/types";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { clearLocalStorage } from "@lib/shared/utils/dom";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PageContainer = dynamic(() => import("@components/DashboardModule/PageContainer"), { ssr: false });

const DEFAULT_PAGEKEYS = ["home", "setting"];

export default function WithPermission(WrappedComponent: FC<any>, pagePermission: string) {
  const WithAuthWrapper = (props: any) => {
    // Hooks
    const router = useRouter();
    const { resources = new Map() } = useSelector((state: RootState) => state.auth.currentUser) || {};

    // State
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const clearAuth = useCallback(() => {
      clearLocalStorage();
      router.replace("/auth/sign-in");
    }, [router]);

    const checkPermission = useCallback(async () => {
      try {
        const hasResource = resources.has(pagePermission) || DEFAULT_PAGEKEYS.includes(pagePermission);
        if (!hasResource) throw new UnauthorizedError("Unauthorized");
      } catch (error) {
        if (error instanceof UnauthorizedError) return clearAuth();
        router.replace("/dashboard/home");
      } finally {
        setIsLoading(false);
      }
    }, [clearAuth, resources, router]);

    useEffect(() => {
      checkPermission();
    }, [checkPermission]);

    if (isLoading) return <Loader />;

    return (
      <PageContainer>
        <WrappedComponent {...props} />
      </PageContainer>
    );
  };

  return WithAuthWrapper;
}
