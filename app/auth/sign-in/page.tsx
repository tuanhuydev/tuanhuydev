"use client";

import { DynamicFormV2Config } from "@app/components/commons/FormV2/DynamicFormV2";
import Loader from "@app/components/commons/Loader";
import { useGlobal } from "@app/components/commons/providers/GlobalProvider";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";
import UnauthorizedError from "lib/commons/errors/UnauthorizedError";
import importDynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import LogService from "server/services/LogService";

const DynamicFormV2 = importDynamic(() => import("@app/components/commons/FormV2/DynamicFormV2"), {
  ssr: false,
  loading: () => <Loader />,
});

const signInFormConfig: DynamicFormV2Config = {
  fields: [
    {
      name: "email",
      type: "email",
      options: {
        size: "small",
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
        size: "small",
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
        <DynamicFormV2 config={signInFormConfig} onSubmit={submit} />
      </div>
    </div>
  );
}
