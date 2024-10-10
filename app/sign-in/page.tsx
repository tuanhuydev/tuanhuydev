"use client";

import BaseInput from "@app/components/commons/Inputs/BaseInput";
import BaseButton from "@app/components/commons/buttons/BaseButton";
import { authWithEmailPassword } from "@app/server/actions/authActions";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

enum FormState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  ERROR = "ERROR",
}

export default function Page() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [formState, setFormState] = useState<FormState>(FormState.IDLE);

  const onSubmit = (event: React.FormEvent) => {
    setFormState(FormState.LOADING);
  };

  useEffect(() => {
    if (error) {
      setFormState(FormState.ERROR);
      setTimeout(() => {
        const currentURL = new URL(window.location.href);
        currentURL.searchParams.delete("error");
        window.history.replaceState({}, "", currentURL.toString());
      }, 1000);
    }

    return () => {
      setFormState(FormState.IDLE);
    };
  }, [error]);

  return (
    <Fragment>
      <div className="bg-white dark:bg-slate-950 flex items-center justify-center w-screen h-screen">
        <div className="h-fit w-96 rounded-md drop-shadow-md bg-white dark:bg-slate-800 px-3 pt-3 pb-5">
          <h1 className="font-sans text-2xl font-bold my-3 dark:text-slate-100">Sign In</h1>
          <form action={authWithEmailPassword} onSubmit={onSubmit} className="flex flex-col gap-4">
            <BaseInput name="email" type="email" required placeholder="Example@email.com" aria-label="Email" />
            <BaseInput name="password" type="password" required placeholder="P@ssw0rd" aria-label="Password" />
            <BaseButton label="Sign In" className="mt-2" type="submit" loading={formState === FormState.LOADING} />
          </form>
          {formState === FormState.ERROR && <p className="text-red-500 text-sm text-center">Invalid Credentials</p>}
        </div>
      </div>
    </Fragment>
  );
}
