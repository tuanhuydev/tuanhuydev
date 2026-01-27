import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export type UpdateUserDTO = Partial<CreateUserDTO>;
