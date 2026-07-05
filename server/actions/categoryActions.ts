"use server";

import { CategoryJSON, CategoryModel } from "@server/models/category.model";
import { categoryService } from "@server/services/CategoryService";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const fetchCategories = unstable_cache(
  async (filter: Record<string, unknown> = {}): Promise<CategoryJSON[]> => {
    const categoryModels: CategoryModel[] = (await categoryService.getAllCategories(filter)) ?? [];
    return categoryModels.map((categoryModel) => categoryModel.toJSON());
  },
  ["categories"],
  { revalidate: 3600, tags: ["categories"] },
);

export const getCategories = cache(async (filter: Record<string, unknown> = {}): Promise<CategoryJSON[]> => {
  return fetchCategories(filter);
});

export const getCategoryById = cache(async (id: string): Promise<CategoryJSON | null> => {
  const categoryModel = await categoryService.getOneCategory(id);
  return categoryModel ? categoryModel.toJSON() : null;
});
