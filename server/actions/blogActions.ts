"use server";

import { PostJSON, PostModel } from "@server/models/post.model";
import { postService } from "@server/services/PostService";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";

const fetchPosts = unstable_cache(
  async (filter: Record<string, unknown> = {}): Promise<PostJSON[]> => {
    const postModels: PostModel[] = (await postService.getAllPosts(filter)) ?? [];
    return postModels.map((postModel) => postModel.toJSON());
  },
  ["posts"],
  { revalidate: 3600, tags: ["posts"] },
);

// Cache wrapper for request deduplication within same render pass
export const getPosts = cache(async (filter: Record<string, unknown> = {}): Promise<PostJSON[]> => {
  return fetchPosts(filter);
});

export const getPostBySlug = cache(async (slug: string): Promise<PostJSON> => {
  const postModel = await postService.getPostBySlug(slug);
  if (!postModel) return redirect("/");
  return postModel.toJSON();
});

export const getPostById = cache(async (id: string): Promise<PostJSON | null> => {
  const postModel = await postService.getOnePost(id);
  return postModel ? postModel.toJSON() : null;
});
