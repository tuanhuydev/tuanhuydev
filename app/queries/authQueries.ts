import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePermissions = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/permissions`);
      if (!response.ok) throw new Error(response.statusText);
      const { data: permissions = [] } = await response.json();
      return permissions;
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/api/auth/sign-out`, { method: "POST" });
      return response;
    },
  });
};
