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
  storyPoint?: number;
  sprintId?: string;
  assigneeId?: string;
  createdById?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
};

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

type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  thumbnail?: string;
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
};
