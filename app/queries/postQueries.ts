import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/shared/commons/constants/base";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostsQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["posts", filter],
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/posts`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch posts");
      const { data: posts = [] } = await response.json();
      return posts;
    },
  });
};

export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/posts/${id}`, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch post");
      const { data } = await response.json();
      return data;
    },
  });
};

export const useCreatePost = () => {
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (post: ObjectType) => {
      const response = await fetch(`${BASE_URL}/api/posts`, { method: "POST", body: JSON.stringify(post) });
      if (!response.ok) throw new Error(response.statusText);
      const { data } = await response.json();
      return data;
    },
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: async (post: ObjectType) => {
      const response = await fetch(`${BASE_URL}/api/posts/${post.id}`, { method: "PATCH", body: JSON.stringify(post) });
      if (!response.ok) throw new Error(response.statusText);
      const { data } = await response.json();
      return data;
    },
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/api/posts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(response.statusText);
      return true;
    },
  });
};
