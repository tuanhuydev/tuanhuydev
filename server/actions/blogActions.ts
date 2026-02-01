"use server";

import { PostJSON, PostModel } from "@server/models/post.model";
import { postService } from "@server/services/PostService";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache wrapper for request deduplication within same render pass
export const getPosts = cache(async (filter: Record<string, unknown> = {}): Promise<PostJSON[]> => {
  const postModels: PostModel[] = (await postService.getAllPosts(filter)) ?? [];
  return postModels.map((postModel) => postModel.toJSON());
});

export const getPostBySlug = cache(async (slug: string): Promise<PostJSON> => {
  const postModel = await postService.getPostBySlug(slug);
  if (!postModel) return redirect("/");
  return postModel.toJSON();
});
