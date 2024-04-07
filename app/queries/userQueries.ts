import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUsers = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      let url = `${BASE_URL}/api/users`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;
      const response = await fetch(url);
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
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/users/me`);
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
