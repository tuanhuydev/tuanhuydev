"use client";

import { DynamicFormConfig } from "@lib/components/commons/Form/DynamicForm";
import { BASE_URL, STORAGE_CREDENTIAL_KEY } from "@lib/configs/constants";
import NotFoundError from "@lib/shared/commons/errors/NotFoundError";
import BaseError from "@shared/commons/errors/BaseError";
import UnauthorizedError from "@shared/commons/errors/UnauthorizedError";
import { ObjectType } from "@shared/interfaces/base";
import { getLocalStorage, setLocalStorage } from "@shared/utils/dom";
import notification from "antd/es/notification";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useEffect } from "react";

const Loader = dynamic(async () => await import("@lib/components/commons/Loader"));

const DynamicForm = dynamic(() => import("@lib/components/commons/Form/DynamicForm"), {
  ssr: false,
  loading: () => <Loader />,
});

const WithAnimation = dynamic(() => import("@lib/components/hocs/WithAnimation"), {
  ssr: false,
  loading: () => <Loader />,
});

// TODO: Move this one to API.
const signInFormConfig: DynamicFormConfig = {
  fields: [
    {
      name: "email",
      type: "email",
      options: {
        size: "large",
        placeholder: "Email",
      },
      validate: {
        required: true,
      },
    },
    {
      name: "password",
      type: "password",
      options: {
        size: "large",
        placeholder: "Password",
      },
      validate: {
        required: true,
      },
    },
  ],
};

export default function SignIn() {
  // Hooks
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const syncAuth = (credential: ObjectType) => {
    if (!credential) throw new UnauthorizedError();
    setLocalStorage(STORAGE_CREDENTIAL_KEY, credential.refreshToken);
    Cookies.set("jwt", credential.accessToken);
  };

  const getCurrentUser = async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`);
    if (!response.ok) throw new NotFoundError("User not found");

    const { data: currentUser } = await response.json();
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  };

  const submit = async (formData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new UnauthorizedError("Invalid sign in");
      const { data: credential } = await response.json();
      if (credential) {
        syncAuth(credential);
        if (credential?.userId) await getCurrentUser(credential?.userId);
        router.push("/dashboard", {});
      }
    } catch (error) {
      api.error({ message: (error as BaseError).message });
    }
  };

  const isAuthenticatedByStorage = useCallback(() => {
    const credential: ObjectType | null = getLocalStorage(STORAGE_CREDENTIAL_KEY);
    return !!credential;
  }, []);

  useEffect(() => {
    const isAuthenticated: boolean = isAuthenticatedByStorage();
    if (isAuthenticated) router.push("/dashboard/home");
  }, [isAuthenticatedByStorage, router]);

  return (
    <WithAnimation>
      <Fragment>
        <div className="bg-white flex items-center justify-center w-screen h-screen" data-testid="sign-in-page-testid">
          <div className="h-fit w-96 drop-shadow-md bg-white px-3 pt-3 pb-5">
            <h1 className="font-sans text-2xl font-bold my-3">Sign In</h1>
            <DynamicForm
              config={signInFormConfig}
              onSubmit={submit}
              submitProps={{ size: "large", className: "w-full" }}
            />
          </div>
        </div>
        {contextHolder}
      </Fragment>
    </WithAnimation>
  );
}
