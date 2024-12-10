"use client";

import { DynamicFormConfig } from "@app/components/commons/Form/DynamicForm";
import Loader from "@app/components/commons/Loader";
import { useGlobal } from "@app/components/commons/providers/GlobalProvider";
import { BASE_URL } from "@lib/configs/constants";
import LogService from "@lib/services/LogService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import importDynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const DynamicForm = importDynamic(() => import("@app/components/commons/Form/DynamicForm"), {
  ssr: false,
  loading: () => <Loader />,
});

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
  submitProps: {
    className: "w-full",
  },
};

export default function SignIn() {
  // Hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const { notify } = useGlobal();

  const submit = useCallback(
    async (formData: any) => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/sign-in`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new UnauthorizedError("Invalid Credentials");

        const { data = {} } = await response.json();
        if (!data || !("accessToken" in data)) throw new UnauthorizedError("Invalid Credentials");

        await queryClient.setQueryData(["accessToken" as unknown as QueryKey], data.accessToken);
        router.push("/dashboard/home");
      } catch (error) {
        LogService.log(error as BaseError);
        notify((error as BaseError).message, "error");
      }
    },
    [notify, queryClient, router],
  );

  return (
    <div
      className="bg-white dark:bg-slate-950 flex items-center justify-center w-screen h-screen"
      data-testid="sign-in-page-testid">
      <div className="h-fit w-96 drop-shadow-md bg-white rounded-md dark:bg-slate-800 px-3 pt-3 pb-5">
        <h1 className="px-2 font-sans text-2xl font-bold my-3 dark:text-slate-100">Sign In</h1>
        <DynamicForm config={signInFormConfig} onSubmit={submit} />
      </div>
    </div>
  );
}
