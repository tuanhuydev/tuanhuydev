"use client";

import styles from "./SignIn.module.css";
import { Button } from "@resources/components/common/Button";
import { ThemeToggle } from "@resources/components/common/ThemeToggle";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { FormInput, InputType } from "@resources/components/formV2/FormInput";
import { logService } from "@server/services/LogService";
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
  const router = useRouter();
  const { notify } = useGlobal();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
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

        localStorage.setItem("accessToken", data.accessToken as string);
        router.push("/dashboard/posts");
      } catch (error) {
        logService.log(error as BaseError);
        notify((error as BaseError).message, "error");
      }
    },
    [notify, router],
  );

  return (
    <div className={styles.page} data-testid="sign-in-page-testid">
      <div className={styles.themeToggleRow}>
        <ThemeToggle size="md" />
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>

        <form onSubmit={handleSubmit(submit)} className={styles.form}>
          <FormInput label="Email" name="email" type={InputType.EMAIL} control={control} placeholder="Email" />
          <FormInput
            label="Password"
            name="password"
            type={InputType.PASSWORD}
            control={control}
            placeholder="Password"
          />
          <Button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
