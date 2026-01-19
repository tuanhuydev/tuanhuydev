import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  thumbnail: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  assets: z.array(z.string()).optional(),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;

export type UpdatePostDTO = Partial<CreatePostDTO>;
