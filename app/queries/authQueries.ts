import { BASE_URL } from "@lib/configs/constants";
import { useMutation } from "@tanstack/react-query";

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/api/auth/sign-out`, { method: "POST" });
      return response;
    },
  });
};
