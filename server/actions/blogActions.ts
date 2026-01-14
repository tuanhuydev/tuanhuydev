"use server";

import { Post } from "@features/Post/post";
import { redirect } from "next/navigation";
import MongoPostRepository from "server/repositories/MongoPostRepository";

const transformPost = (post: Record<string, unknown>): Post => {
  const { _id, createdAt, updatedAt, ...restPost } = post;
  return {
    ...restPost,
    id: String(_id),
    createdAt: createdAt ? new Date(createdAt as string).toISOString() : new Date().toISOString(),
    updatedAt: updatedAt ? new Date(updatedAt as string).toISOString() : new Date().toISOString(),
  } as unknown as Post;
};

export const getPosts = async (filter: Record<string, unknown> = {}): Promise<Post[]> => {
  const posts = (await MongoPostRepository.getPosts(filter)) ?? [];
  return posts.map(transformPost);
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const post = await MongoPostRepository.getPostBySlug(slug);
  if (!post) return redirect("/");

  return {
    ...transformPost(post),
    slug,
  };
};
