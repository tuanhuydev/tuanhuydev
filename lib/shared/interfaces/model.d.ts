enum TASK_TYPE {
  BUG = "BUG",
  ISSUE = "ISSUE",
  STORY = "STORY",
  EPIC = "EPIC",
}
type Task = {
  id: string;
  title: string;
  description?: string;
  type: TASK_TYPE;
  projectId?: string;
  sprintId?: string;
  assigneeId?: string;
  createdById?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
};
type TaskBody = Omit<Task, "id">;

type Sprint = {
  id: string;
  name: string;
  description?: string;
  fromDate?: Date;
  toDate?: Date;
  projectId?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
};
