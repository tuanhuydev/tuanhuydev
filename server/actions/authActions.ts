"use server";

import AuthService, { TokenPayload } from "@lib/services/AuthService";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().trim().min(5),
  password: z.string().min(5),
});

export type CredentialWithEmailPassword = z.infer<typeof schema>;

export const authWithEmailPassword = async (form: FormData) => {
  const credentials: CredentialWithEmailPassword = {
    email: form.get("email") as string,
    password: form.get("password") as string,
  };
  const result = schema.safeParse(credentials);
  if (!result.success) return redirect("/sign-in?error=Invalid+Credentials", "replace" as RedirectType);

  const auth: TokenPayload | null = await AuthService.signIn(credentials.email, credentials.password);
  if (!auth) return redirect("/sign-in?error=Invalid+Credentials", "replace" as RedirectType);

  const { accessToken, refreshToken = "" } = auth;
  cookies().set("jwt", refreshToken, { sameSite: "strict", httpOnly: true });
  return redirect("/dashboard");
};
