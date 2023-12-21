import PageContainer from "@lib/DashboardModule/PageContainer";
import { BASE_URL, STORAGE_CREDENTIAL_KEY } from "@lib/configs/constants";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { ObjectType } from "@lib/shared/interfaces/base";
import { clearLocalStorage, getLocalStorage, setLocalStorage } from "@lib/shared/utils/dom";
import { authActions } from "@lib/store/slices/authSlice";
import { User } from "@prisma/client";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { FC, Fragment, ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type UserWithPermission = User & { permissionId: number };

const Sidebar = dynamic(() => import("@lib/DashboardModule/Sidebar"), { ssr: false });

export default function WithAuth(WrappedComponent: FC<any>) {
  const WithAuthWrapper = (props: any) => {
    const [validated, setValidate] = useState(false);
    const [title, setTitle] = useState<string>("Title");
    const [pageKey, setPageKey] = useState<string>("Home");
    const storageUser: UserWithPermission = getLocalStorage("currentUser");

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
      if (!response.ok) throw new Error("Resources not found");

      const { data = [] } = await response.json();
      const resources = new Map();
      if (data.length) {
        data.forEach((item: ObjectType) => {
          resources.set(item.name, item);
        });
      }
      return resources;
    }, []);

    const init = useCallback(async () => {
      try {
        if (!storageUser || !storageUser.permissionId) throw new Error("Credential not found");

        const resources = await fetchResource(storageUser.permissionId);
        const userWithResources = { ...storageUser, resources };

        dispatch(authActions.setCurrentUser(userWithResources));
        setLocalStorage("currentUser", JSON.stringify(userWithResources));

        const hasCookie = !!Cookies.get("jwt");
        const hasCredential = !!getLocalStorage(STORAGE_CREDENTIAL_KEY) as boolean;
        const hasStorageUser = !!storageUser;

        setValidate(hasCookie && hasCredential && hasStorageUser);
      } catch (error) {
        clearAuth();
      }
    }, [clearAuth, dispatch, fetchResource, storageUser]);

    useEffect(() => {
      init();
    }, [init]);

    const enhancedProps = {
      ...props,
      setTitle,
      setPageKey,
    };

    return validated ? (
      <div className="w-full h-screen overflow-hidden flex flex-nowrap">
        <div className="flex w-full relative">
          <Sidebar />
          <PageContainer pageKey={pageKey} title={title}>
            <WrappedComponent {...enhancedProps} />
          </PageContainer>
        </div>
      </div>
    ) : (
      <Fragment />
    );
  };
  return WithAuthWrapper;
}
