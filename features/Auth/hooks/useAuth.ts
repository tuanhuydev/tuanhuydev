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
  permissionId: string;
}

export interface Permission {
  id: string;
  name: string;
  rules: string[];
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
        throw new BaseError(`Failed to fetch current user: ${response.status} ${response.statusText}`);
      }
      const { data: user = {} } = (await response.json()) as { data: User };
      return user as User;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof BaseError && error.message.includes("401")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Current user permissions query
  const {
    data: permissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
  } = useQuery({
    queryKey: ["permissions", "current"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me/permissions`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch permissions: ${response.status} ${response.statusText}`);
      }
      const { data: permissions = [] } = (await response.json()) as { data: Permission[] };
      return permissions.flatMap((permission: Permission) => permission.rules);
    },
    enabled: !!currentUser, // Only fetch permissions if user is loaded
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Computed state
  const isAuthenticated = !!currentUser && !userError;
  const isLoading = isLoadingUser || isLoadingPermissions;

  // Permission checker utility
  const hasPermission = (permission: string): boolean => {
    if (!permissions || !isAuthenticated) return false;
    return permissions.includes(permission);
  };

  // Check multiple permissions (user needs ALL of them)
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (!permissions || !isAuthenticated) return false;
    return requiredPermissions.every((permission) => permissions.includes(permission));
  };

  // Check multiple permissions (user needs unknown of them)
  const hasunknownPermission = (requiredPermissions: string[]): boolean => {
    if (!permissions || !isAuthenticated) return false;
    return requiredPermissions.some((permission) => permissions.includes(permission));
  };

  return {
    // User state
    currentUser,
    permissions,
    isAuthenticated,
    isLoading,
    isSigningOut,

    // Errors
    userError,
    permissionsError,

    // Methods
    fetch,
    signOut,
    refetchUser,
    hasPermission,
    hasAllPermissions,
    hasunknownPermission,
  };
};

export default useAuth;
