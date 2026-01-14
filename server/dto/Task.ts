import { TASK_TYPE } from "@server/models/task.model";
import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.nativeEnum(TASK_TYPE),
  storyPoint: z.number().optional(),
  parentTaskId: z.string().optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;

export type UpdateTaskDTO = Partial<CreateTaskDTO>;
