import { useFetch } from "./queries/useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

export const useResourcesQuery = (permissionId: number) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["resources", permissionId],
    queryFn: async () => {
      const response: any = await fetch(`${BASE_URL}/api/resources/permission/${permissionId}`);
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

export const usePostsQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["posts", filter],
    queryFn: async () => {
      let url = `${BASE_URL}/api/posts`;
      if (url) {
        const queryString = qs.stringify(filter);
        url += `?${queryString}`;
      }

      const response: Response = await fetch(url);
      if (!response.ok) throw new BaseError("Unable to fetch posts");
      const { data: posts = [] } = await response.json();
      return posts;
    },
  });
};
