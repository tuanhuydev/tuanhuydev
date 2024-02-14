"use client";

import getQueryClient from "@app/_configs/queryClient";
import { authActions } from "@app/_store/slices/authSlice";
import Loader from "@components/commons/Loader";
import { QueryProvider } from "@components/commons/providers/QueryProvider";
import ReduxProvider from "@components/commons/providers/ReduxProvider";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { clearLocalStorage, getLocalStorage } from "@lib/shared/utils/dom";
import "@styles/globals.scss";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";

const App = dynamic(async () => (await import("antd/es/app")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Sidebar = dynamic(async () => (await import("@app/_components/DashboardModule/Sidebar")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Wrapper = ({ children }: PropsWithChildren) => {
  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchResources = useCallback(async (permissionId: number) => {
    const response: any = await fetch(`${BASE_URL}/api/resources/permission/${permissionId}`, {
      headers: { authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    if (response?.status === 401) throw new UnauthorizedError("Resources not found");
    if (!response.ok) throw new BaseError("Resources not found");

    const { data: items = [] } = await response.json();
    const resources = new Map();

    for (let item of items) {
      resources.set(item.name, item);
    }
    return resources;
  }, []);

  const verifyAuth = useCallback(async () => {
    try {
      const hasJwtKey = Cookies.get("jwt");
      const hasRefreshToken = getLocalStorage("credential");
      const userDetail = getLocalStorage("userDetail");

      if (!hasJwtKey || !hasRefreshToken || !userDetail) throw new UnauthorizedError("Unauthorized");
      const resources = await fetchResources(userDetail.permissionId);
      const updatedUser = {
        ...userDetail,
        resources,
      };
      dispatch(authActions.setCurrentUser(updatedUser));
    } catch (error) {
      clearLocalStorage();
      router.replace("/auth/sign-in");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, fetchResources, router]);

  useLayoutEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center flex-nowrap">
      <div className="flex self-stretch w-full relative">
        <Sidebar />
        <div className="grow flex flex-col z-2">{children}</div>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(getQueryClient())}>
        <ReduxProvider>
          <App>
            <Wrapper>{children}</Wrapper>
          </App>
        </ReduxProvider>
      </HydrationBoundary>
    </QueryProvider>
  );
}
