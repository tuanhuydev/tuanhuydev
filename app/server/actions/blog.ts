"use server";

import PostService from "@lib/services/PostService";

export const getHighlightPosts = async (filter: FilterType = {}) => {
  const posts = (await PostService.getPosts(filter)) ?? [];
  return posts;
};

export const getPostBySlug = async (slug: string) => {
  const post = (await PostService.getPost(slug)) || "";
  return post;
};
