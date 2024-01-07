"use client";

import Loader from "@components/commons/Loader";
import { BASE_URL, STORAGE_CREDENTIAL_KEY } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { ObjectType } from "@lib/shared/interfaces/base";
import { clearLocalStorage, getLocalStorage, setLocalStorage } from "@lib/shared/utils/dom";
import { User } from "@prisma/client";
import { authActions } from "@store/slices/authSlice";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { FC, Fragment, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";

type UserWithPermission = User & { permissionId: number };

const Sidebar = dynamic(() => import("@components/DashboardModule/Sidebar"), { ssr: false });
const PageContainer = dynamic(() => import("@components/DashboardModule/PageContainer"), { ssr: false });

export default function WithAuth(WrappedComponent: FC<any>) {
  const DEFAULT_PAGEKEYS = ["home", "setting"];

  const WithAuthWrapper = (props: any) => {
    const [pageKey, setPageKey] = useState<string>("home");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasPermission, setHasPermission] = useState<boolean>(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const clearAuth = useCallback(() => {
      clearLocalStorage();
      router.replace("/auth/sign-in");
    }, [router]);

    const fetchResource = useCallback(async (permissionId: number) => {
      const response: any = await fetch(`${BASE_URL}/api/resources/permission/${permissionId}`, {
        headers: { authorization: `Bearer ${Cookies.get("jwt")}` },
      });
      if (response?.status === 401) throw new UnauthorizedError("Resources not found");
      if (!response.ok) throw new BaseError("Resources not found");

      const { data = [] } = await response.json();
      const resources = new Map();
      if (data.length) {
        data.forEach((item: ObjectType) => {
          resources.set(item.name, item);
        });
      }
      return resources;
    }, []);

    const updateUserWithResources = useCallback(
      (user: UserWithPermission, resources: Map<string, ObjectType>) => {
        const userWithResources = { ...user, resources };

        dispatch(authActions.setCurrentUser(userWithResources));
        setLocalStorage("currentUser", JSON.stringify(userWithResources));
      },
      [dispatch],
    );

    const checkPermission = useCallback(async () => {
      try {
        const storageUser: UserWithPermission = getLocalStorage("currentUser");

        if (!storageUser || !storageUser?.permissionId) {
          throw new BaseError("Credential not found");
        }

        const resources = await fetchResource(storageUser.permissionId);
        updateUserWithResources(storageUser, resources);

        const hasCookie = !!Cookies.get("jwt");
        const hasCredential = !!getLocalStorage(STORAGE_CREDENTIAL_KEY) as boolean;
        const hasResource = resources.has(pageKey) || DEFAULT_PAGEKEYS.includes(pageKey);
        setHasPermission(hasCookie && hasCredential && hasResource);
      } catch (error) {
        if (error instanceof UnauthorizedError) return clearAuth();
        router.replace("/dashboard/home");
      } finally {
        setIsLoading(false);
      }
    }, [clearAuth, fetchResource, pageKey, router, updateUserWithResources]);

    useLayoutEffect(() => {
      checkPermission();
    }, [checkPermission]);

    const enhancedProps = {
      ...props,
      setPageKey,
    };

    if (isLoading) return <Loader />;

    if (hasPermission) {
      return (
        <div className="w-full h-screen overflow-hidden flex flex-nowrap">
          <div className="flex w-full relative">
            <Sidebar />
            <PageContainer>
              <WrappedComponent {...enhancedProps} />
            </PageContainer>
          </div>
        </div>
      );
    }
    clearAuth();
    return <Fragment />;
  };

  return WithAuthWrapper;
}
