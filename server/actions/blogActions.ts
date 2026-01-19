"use server";

import { PostJSON, PostModel } from "@server/models/post.model";
import { postService } from "@server/services/PostService";
import { redirect } from "next/navigation";

export const getPosts = async (filter: Record<string, unknown> = {}): Promise<PostJSON[]> => {
  const postModels: PostModel[] = (await postService.getAllPosts(filter)) ?? [];
  return postModels.map((postModel) => postModel.toJSON());
};

export const getPostBySlug = async (slug: string): Promise<PostJSON> => {
  const postModel = await postService.getPostBySlug(slug);
  if (!postModel) return redirect("/");
  return postModel.toJSON();
};
