import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Post } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostsQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      let url = `${BASE_URL}/api/posts`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new BaseError("Unable to fetch posts");
      const { data: posts = [] } = await response.json();
      return posts;
    },
  });
};

export const usePostQuery = (id: number) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/posts/${id}`);
      if (!response.ok) throw new Error(response.statusText);
      const { data: post } = await response.json();
      return post;
    },
  });
};

export const useCreatePost = () => {
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const response = await fetch(`${BASE_URL}/api/posts`, { method: "POST", body: JSON.stringify(post) });
      if (!response.ok) throw new Error(response.statusText);
      const { data } = await response.json();
      return data;
    },
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const response = await fetch(`${BASE_URL}/api/posts/${post.id}`, { method: "PATCH", body: JSON.stringify(post) });
      if (!response.ok) throw new Error(response.statusText);
      const { data } = await response.json();
      return data;
    },
  });
};
