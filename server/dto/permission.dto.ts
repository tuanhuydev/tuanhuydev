import { RuleAction, RuleType } from "@server/models/permission.model";
import { z } from "zod";

export const ruleSchema = z.object({
  type: z.nativeEnum(RuleType),
  action: z.nativeEnum(RuleAction),
  resourceId: z.string(),
});

// 2. Define the Create Permission Schema
export const createPermissionSchema = z.object({
  id: z.string().optional(),
  rules: z.array(ruleSchema),
});

export type Rule = z.infer<typeof ruleSchema>;

export type CreatePermissionDTO = z.infer<typeof createPermissionSchema>;

export type UpdatePermissionDTO = Partial<CreatePermissionDTO>;
