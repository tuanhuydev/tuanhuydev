"use client";

import { useSignOut } from "./authQueries";
import { useQueryClient } from "@tanstack/react-query";
import { HTTP_CODE } from "lib/commons/constants/httpCode";
import BaseError from "lib/commons/errors/BaseError";
import UnauthorizedError from "lib/commons/errors/UnauthorizedError";
import { useRouter } from "next/navigation";

export const useFetch = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: signUserOut } = useSignOut();

  const signOut = async () => {
    await signUserOut();
    queryClient.removeQueries();
    router.replace("/auth/sign-in");
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    try {
      const accessToken = queryClient.getQueryData<string>(["accessToken"]);

      if (!accessToken) throw new UnauthorizedError("Access token is missing");
      const headers = options.headers || {};
      const updatedOptions = {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, updatedOptions);

      if (!response.ok) {
        if (response.status !== HTTP_CODE.UNAUTHORIZED_ERROR) {
          throw new BaseError(response.statusText);
        }
        throw new UnauthorizedError();
      }
      return response;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        signOut();
      }
      throw error;
    }
  };

  return { fetch: fetchWithAuth, signOut };
};
