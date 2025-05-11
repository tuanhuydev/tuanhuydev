import { ObjectId } from "mongodb";

export enum CommentType {
  TASK = "task",
  POST = "post",
}

export type CommentAuthor = {
  id: ObjectId;
  name: string;
  email: string;
};

export type Comment = {
  id: ObjectId;
  parentId: ObjectId | null;
  authorId: ObjectId;
  targetId: ObjectId;
  author: CommentAuthor;
  targetType: CommentType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
