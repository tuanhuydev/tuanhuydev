import { z } from "zod";

const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema> & {
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
