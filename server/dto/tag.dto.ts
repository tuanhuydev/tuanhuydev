import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export type CreateTagDTO = z.infer<typeof createTagSchema>;

export type UpdateTagDTO = Partial<CreateTagDTO>;
