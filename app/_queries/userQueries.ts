import { QUERY_KEYS, createStableQueryKey } from "./queryKeys";
import { useFetch } from "./useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";
import { useMemo } from "react";

export const useUsersQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();
  const queryKey = useMemo(() => createStableQueryKey([QUERY_KEYS.USERS], filter), [filter]);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/users`;
      const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([_, value]) => value !== "" && value != null),
      ) as Record<string, string>;
      if (Object.keys(cleanFilter).length > 0) {
        url = `${url}?${new URLSearchParams(cleanFilter).toString()}`;
      }
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const { data: users = [] } = await response.json();
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
        Object.entries(filter).filter(([_, value]) => value !== "" && value != null),
      ) as Record<string, string>;
      if (Object.keys(cleanFilter).length > 0) {
        url = `${url}?${new URLSearchParams(cleanFilter).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch current user tasks: ${response.status} ${response.statusText}`);
      }
      const { data: tasks = [] } = await response.json();
      return tasks;
    },
  });
};

export const useProjectUsers = (projectId: string) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, projectId, QUERY_KEYS.USERS],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}/users`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch project users: ${response.status} ${response.statusText}`);
      }
      const { data: users = [] } = await response.json();
      return users;
    },
    enabled: !!projectId,
  });
};

export const useCurrentUser = () => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    enabled: false,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch current user: ${response.status} ${response.statusText}`);
      }
      const { data: currentUser = {} } = await response.json();
      return currentUser;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (newUser: ObjectType) => {
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

      const result = await response.json();

      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });

      return result;
    },
  });
};

export const useUpdateUserDetail = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (user: ObjectType) => {
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

      const result = await response.json();

      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] }); // Invalidate current user if updating self
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });

      // Invalidate user permissions
      if (user.id) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PERMISSIONS, "user", user.id],
        });
      }

      return result;
    },
  });
};
