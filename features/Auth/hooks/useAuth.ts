"use client";

import { useFetch } from "./useFetch";
import { BASE_URL } from "@lib/commons/constants/base";
import BaseError from "@lib/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

/**
 * Comprehensive authentication hook that provides user state and auth utilities
 */
export const useAuth = () => {
  const { fetch, signOut, isSigningOut } = useFetch();

  // Current user query
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me`, { signal });
      if (!response.ok) {
        const error = new BaseError(`Failed to fetch current user: ${response.status} ${response.statusText}`);
        throw error;
      }
      const { data: user = {} } = (await response.json()) as { data: User };
      return user as User;
    },
    retry: false, // Don't retry auth failures
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Computed state
  const isAuthenticated = !!currentUser && !userError;
  const isLoading = isLoadingUser;

  return {
    // User state
    currentUser,
    isAuthenticated,
    isLoading,
    isSigningOut,

    // Errors
    userError,

    // Methods
    fetch,
    signOut,
    refetchUser,
  };
};

export default useAuth;
