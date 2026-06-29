"use client";

import { useFetch } from "./useFetch";
import { BASE_URL } from "@lib/commons/constants/base";
import { useCallback, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export const useAuth = () => {
  const { fetch, signOut } = useFetch();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/me`);
      const { data } = (await response.json()) as { data: User };
      setCurrentUser(data);
      setUserError(null);
    } catch (error) {
      setUserError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetch]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return {
    currentUser,
    isAuthenticated: !!currentUser && !userError,
    isLoading,
    userError,
    fetch,
    signOut,
    refetchUser: fetchUser,
  };
};

export default useAuth;
