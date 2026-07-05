import { z } from "zod";

export const createSeriesSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export type CreateSeriesDTO = z.infer<typeof createSeriesSchema>;

export type UpdateSeriesDTO = Partial<CreateSeriesDTO>;
