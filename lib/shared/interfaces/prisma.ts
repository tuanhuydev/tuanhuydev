import { Task } from "@prisma/client";

export interface TaskStatusAssignee extends Task {
  assignee?: { id: string; name: string };
  status: { name: string; color: string };
}
