"use client";

import Loader from "@app/_components/commons/Loader";
import { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import { BASE_URL } from "@lib/configs/constants";
import LogService from "@lib/services/LogService";
import BaseError from "@shared/commons/errors/BaseError";
import UnauthorizedError from "@shared/commons/errors/UnauthorizedError";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import notification from "antd/es/notification";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";

const DynamicForm = dynamic(() => import("@components/commons/Form/DynamicForm"), {
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
  const queryClient = useQueryClient();
  // Hooks
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const submit = async (formData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new UnauthorizedError("Invalid Credentials");
      const {
        data: { accessToken },
      } = await response.json();

      await queryClient.setQueryData(["accessToken" as unknown as QueryKey], accessToken);
      router.push("/dashboard/home");
    } catch (error) {
      LogService.log(error as BaseError);
      api.error({ message: (error as BaseError).message });
    }
  };

  return (
    <Fragment>
      <div
        className="bg-white dark:bg-slate-950 flex items-center justify-center w-screen h-screen"
        data-testid="sign-in-page-testid">
        <div className="h-fit w-96 drop-shadow-md bg-white dark:bg-slate-800 px-3 pt-3 pb-5">
          <h1 className="font-sans text-2xl font-bold my-3 dark:text-slate-100">Sign In</h1>
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
