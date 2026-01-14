enum TASK_TYPE {
  BUG = "BUG",
  ISSUE = "ISSUE",
  STORY = "STORY",
  EPIC = "EPIC",
}
export type Task = {
  id: string;
  title: string;
  description?: string;
  type: TASK_TYPE;
  subTasks?: Task[];
  projectId?: string;
  parentId?: string;
  storyPoint?: number;
  sprintId?: string;
  assigneeId?: string;
  createdById?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
};
