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
  projectId: number;
  sprintId?: number;
  assigneeId?: string;
  createdById?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
