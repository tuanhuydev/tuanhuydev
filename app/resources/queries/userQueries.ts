import { QUERY_KEYS, createStableQueryKey } from "./queryKeys";
import { useFetch } from "@features/Auth";
import { User } from "@lib/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";
import { useMemo } from "react";

export const useUsersQuery = (filter: Record<string, unknown> = {}) => {
  const { fetch } = useFetch();
  const queryKey = useMemo(() => createStableQueryKey([QUERY_KEYS.USERS], filter), [filter]);

  return useQuery<User[]>({
    queryKey,
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/users`;
      const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([, value]) => value !== "" && value != null),
      ) as Record<string, string>;
      if (Object.keys(cleanFilter).length > 0) {
        url = `${url}?${new URLSearchParams(cleanFilter).toString()}`;
      }
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const { data: users = [] } = (await response.json()) as { data: User[] };
      return users;
    },
  });
};

export const useCurrentUserTasks = (filter = {}) => {
  const { fetch } = useFetch();
  const queryKey = useMemo(() => createStableQueryKey([QUERY_KEYS.CURRENT_USER, QUERY_KEYS.TASKS], filter), [filter]);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      let url: string = `${BASE_URL}/api/users/me/tasks`;
      const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([, value]) => value !== "" && value != null),
      ) as Record<string, string>;
      if (Object.keys(cleanFilter).length > 0) {
        url = `${url}?${new URLSearchParams(cleanFilter).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch current user tasks: ${response.status} ${response.statusText}`);
      }
      const { data: tasks = [] } = (await response.json()) as { data: Record<string, unknown>[] };
      return tasks;
    },
  });
};

export const useCurrentUser = () => {
  const { fetch } = useFetch();

  return useQuery<User>({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch current user: ${response.status} ${response.statusText}`);
      }
      const { data: currentUser } = (await response.json()) as { data: User };
      return currentUser;
    },
    retry: false, // Don't retry auth failures
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (newUser: Partial<User> & { password: string; confirmPassword: string }) => {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to create user: ${response.status} ${response.statusText}`);
      }

      const result = (await response.json()) as { data: User };

      // Invalidate users queries
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });

      return result;
    },
  });
};

export const useUpdateUserDetail = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (user: Partial<User> & { id: string }) => {
      const response = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to update user: ${response.status} ${response.statusText}`);
      }

      const result = (await response.json()) as { data: User };

      // Invalidate users queries
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] }); // Invalidate current user if updating self
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });

      return result;
    },
  });
};
