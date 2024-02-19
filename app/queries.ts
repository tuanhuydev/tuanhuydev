import { apiWithBearer } from "./_utils/network";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useResourcesQuery = (permissionId: number) => {
  return useQuery({
    queryKey: ["resources", permissionId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response: any = await fetch(`${BASE_URL}/api/resources/permission/${permissionId}`, {
        headers: { authorization: `Bearer ${Cookies.get("jwt")}` },
      });
      if (response?.status === 401) throw new UnauthorizedError("Resources not found");
      if (!response.ok) throw new BaseError("Resources not found");

      const { data = [] } = await response.json();
      const resources = new Map();
      if (data.length) {
        data.forEach((item: ObjectType) => {
          resources.set(item.name, item);
        });
      }
      return resources;
    },
  });
};

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ["posts"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const { data: posts = [] } = await apiWithBearer(`${BASE_URL}/api/posts`);
      return posts;
    },
  });
};
