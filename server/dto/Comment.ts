import { CommentType } from "@server/models/Comment";

export type CreateCommentDto = Omit<Comment, "id" | "createdAt" | "updatedAt" | "deletedAt">;
export type UpdateCommentDto = Partial<CreateCommentDto>;

export type CreateTaskCommentDto = Omit<CreateCommentDto, "targetType"> & {
  targetType: CommentType.TASK;
};
