// This page will contain MongoDB document definitions for Task
import { ObjectId } from "mongodb";

export type TaskDocument = {
  _id: ObjectId;
  title: string;
  description?: string;
  type: string;
  storyPoint: number;

  projectId: ObjectId | null;
  sprintId: ObjectId | null;
  assigneeId: ObjectId | null;
  createdById: ObjectId | null;
  parentTaskId: ObjectId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
