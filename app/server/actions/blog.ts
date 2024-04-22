"use server";

import MongoPostRepository from "@lib/repositories/MongoPostRepository";

export const getPosts = async (filter: ObjectType = {}) => {
  const posts = (await MongoPostRepository.getPosts(filter)) ?? [];
  return posts.map(({ _id, title, thumbnail, content, slug, createdAt, updatedAt }) => ({
    _id: String(_id),
    title,
    content,
    slug,
    thumbnail,
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
  }));
};

export const getPostBySlug = async (slug: string) => {
  const post = await MongoPostRepository.getPostBySlug(slug);
  if (post) {
    const { _id, title, thumbnail, content, slug, createdAt, updatedAt } = post;
    return {
      _id: String(_id),
      title,
      content,
      slug,
      thumbnail,
      createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
      updatedAt: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
    };
  }
  return post;
};
