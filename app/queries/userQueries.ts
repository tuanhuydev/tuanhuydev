import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/shared/commons/constants/base";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsersQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["users", filter],
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/users`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;
      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError(response.statusText);
      const { data: users = [] } = await response.json();
      return users;
    },
  });
};

export const useCurrentUserTasks = (filter = {}) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["currentUser", "tasks", filter],
    queryFn: async ({ signal }) => {
      let url: string = `${BASE_URL}/api/users/me/tasks`;
      if (filter) {
        url = `${url}?${new URLSearchParams(filter).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError(response.statusText);
      const { data: tasks = [] } = await response.json();
      return tasks;
    },
  });
};

export const useProjectUsers = (projectId: string) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["projects", projectId, "users"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}/users`, { signal });
      if (!response.ok) throw new BaseError(response.statusText);
      const { data: users = [] } = await response.json();
      return users;
    },
  });
};

export const useCurrentUser = () => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me`, { signal });
      if (!response.ok) throw new BaseError(response.statusText);
      const { data: currentUser = {} } = await response.json();
      return currentUser;
    },
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
      if (!response.ok) throw new BaseError(response.statusText);
      queryClient.invalidateQueries(["users"] as InvalidateQueryFilters);
      return response.json();
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
      if (!response.ok) throw new BaseError(response.statusText);
      queryClient.invalidateQueries(["users"] as InvalidateQueryFilters);
      return response.json();
    },
  });
};
