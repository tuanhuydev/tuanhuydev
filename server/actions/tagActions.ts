"use server";

import { TagJSON, TagModel } from "@server/models/tag.model";
import { tagService } from "@server/services/TagService";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const fetchTags = unstable_cache(
  async (filter: Record<string, unknown> = {}): Promise<TagJSON[]> => {
    const tagModels: TagModel[] = (await tagService.getAllTags(filter)) ?? [];
    return tagModels.map((tagModel) => tagModel.toJSON());
  },
  ["tags"],
  { revalidate: 3600, tags: ["tags"] },
);

export const getTags = cache(async (filter: Record<string, unknown> = {}): Promise<TagJSON[]> => {
  return fetchTags(filter);
});

export const getTagById = cache(async (id: string): Promise<TagJSON | null> => {
  const tagModel = await tagService.getOneTag(id);
  return tagModel ? tagModel.toJSON() : null;
});
