"use client";

import Loader from "@app/_components/commons/Loader";
import { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import { BASE_URL } from "@lib/configs/constants";
import NotFoundError from "@lib/shared/commons/errors/NotFoundError";
import BaseError from "@shared/commons/errors/BaseError";
import UnauthorizedError from "@shared/commons/errors/UnauthorizedError";
import { setLocalStorage } from "@shared/utils/dom";
import notification from "antd/es/notification";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback } from "react";

const DynamicForm = dynamic(() => import("@components/commons/Form/DynamicForm"), {
  ssr: false,
  loading: () => <Loader />,
});

type CredentialType = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

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

  const getUserDetail = useCallback(async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`);
    if (!response.ok) throw new NotFoundError("User not found");
    const { data: userDetail } = await response.json();
    return userDetail;
  }, []);

  const submit = async (formData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new UnauthorizedError("Invalid Credentials");

      // const { data: credential } = await response.json();
      // const { userId } = (credential as CredentialType) ?? {};
      // if (!userId) throw new UnauthorizedError("Invalid Credentials");

      // const userDetail = await getUserDetail(userId);
      // setLocalStorage("userDetail", JSON.stringify(userDetail));
      router.push("/dashboard/home");
      console.log("router push");
    } catch (error) {
      console.log((error as Error).message);
      api.error({ message: (error as BaseError).message });
    }
  };

  return (
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
  );
}
