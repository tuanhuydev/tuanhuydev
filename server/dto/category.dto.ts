import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
