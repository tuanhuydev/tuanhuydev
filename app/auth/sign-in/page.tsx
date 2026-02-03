"use client";

import { Button } from "@resources/components/common/Button";
import { ThemeToggle } from "@resources/components/common/ThemeToggle";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { FormInput, InputType } from "@resources/components/formV2/FormInput";
import { logService } from "@server/services/LogService";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";
import UnauthorizedError from "lib/commons/errors/UnauthorizedError";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  // Hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const { notify } = useGlobal();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = useCallback(
    async (formData: SignInFormData) => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/sign-in`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new UnauthorizedError("Invalid Credentials");

        const { data = {} } = (await response.json()) as { data?: { accessToken: string } };
        if (!data || !("accessToken" in data)) throw new UnauthorizedError("Invalid Credentials");

        await queryClient.setQueryData(["accessToken" as unknown as QueryKey], data.accessToken);
        localStorage.setItem("accessToken", data.accessToken as string);
        router.push("/dashboard/home");
      } catch (error) {
        logService.log(error as BaseError);
        notify((error as BaseError).message, "error");
      }
    },
    [notify, queryClient, router],
  );

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center bg-white dark:bg-slate-950"
      data-testid="sign-in-page-testid">
      <div className="absolute top-0 z-10 flex w-full justify-end p-4">
        <ThemeToggle size="md" />
      </div>

      <div className="h-fit w-96 rounded-md bg-white px-6 pb-6 pt-5 drop-shadow-md dark:bg-slate-800">
        <h1 className="mb-6 font-sans text-2xl font-bold dark:text-slate-100">Sign In</h1>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <FormInput label="Email" name="email" type={InputType.EMAIL} control={control} placeholder="Email" />

          <FormInput
            label="Password"
            name="password"
            type={InputType.PASSWORD}
            control={control}
            placeholder="Password"
          />

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
