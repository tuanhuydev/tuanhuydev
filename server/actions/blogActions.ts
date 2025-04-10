"use server";

import { redirect } from "next/navigation";
import MongoPostRepository from "server/repositories/MongoPostRepository";

const transformPost = (post: ObjectType): Post => {
  const { _id, createdAt, updatedAt, ...restPost } = post;
  return {
    ...restPost,
    id: String(_id),
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
  } as unknown as Post;
};

export const getPosts = async (filter: ObjectType = {}): Promise<Post[]> => {
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
