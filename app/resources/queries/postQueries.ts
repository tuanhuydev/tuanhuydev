import { useGlobal } from "../components/common/providers/GlobalProvider";
import { Post } from "../types/post.types";
import { useFetch } from "@features/Auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const usePostsQuery = (filter: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: ["posts", filter],
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/posts`;
      if (filter) url = `${url}?${new URLSearchParams(filter as Record<string, string>).toString()}`;

      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch posts");
      const { data: posts = [] } = (await response.json()) as { data: Post[] };
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
      const { data } = (await response.json()) as { data: Post };
      return data;
    },
  });
};

export const useCreatePost = () => {
  const { fetch } = useFetch();
  const { notify } = useGlobal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const response = await fetch(`${BASE_URL}/api/posts`, { method: "POST", body: JSON.stringify(post) });
      if (!response.ok) throw new Error(response.statusText);
      const { data } = (await response.json()) as { data: Post };
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      notify("Post saved successfully", "success");
    },
    onError() {
      notify("Failed to save post", "error");
    },
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const response = await fetch(`${BASE_URL}/api/posts/${post?.id}`, {
        method: "PATCH",
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error(response.statusText);
      const { data } = (await response.json()) as { data: Post };
      return data;
    },
  });
};

export const useDeletePost = () => {
  const { notify } = useGlobal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/api/posts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(response.statusText);
      return true;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      notify("Post deleted successfully", "success");
    },
    onError() {
      notify("Failed to delete post", "error");
    },
  });
};
