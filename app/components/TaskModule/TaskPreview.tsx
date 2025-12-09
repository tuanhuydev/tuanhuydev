"use client";

import { CommentForm } from "../commons/CommentForm";
import { CommentRow } from "../commons/CommentRow";
import TaskRow from "./TaskRow";
import { useMutateTaskComment, useTaskComment } from "@app/_queries/commentQueries";
import { useSubTasks } from "@app/_queries/taskQueries";
import { TaskStatus, TaskStatusEnum } from "@app/_utils/constants";
import Badge from "@app/components/commons/Badge";
import BaseLabel from "@app/components/commons/BaseLabel";
import { CreateCommentDto } from "@server/dto/Comment";
import { Comment } from "@server/models/Comment";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { Fragment, Suspense, lazy } from "react";

const ReactMarkdown = lazy(() => import("react-markdown"));

export interface TaskPreviewProps {
  task: ObjectType | null;
  assignee?: SelectOptionType | null;
  sprint?: ObjectType | null;
}
export default function TaskPreview({ task, assignee, sprint }: TaskPreviewProps) {
  const { data: subTasks = [] } = useSubTasks(task?.id || "");
  const { data: comments = [] as Comment[] } = useTaskComment(task?.id);
  const { mutateAsync } = useMutateTaskComment(task?.id || "");

  const { title = "", description = "", status = "" } = task || {};

  const taskStatus = TaskStatus[status as TaskStatusEnum] || TaskStatus.TODO;

  const selectSubTask = (subTask: ObjectType) => () => {
    if (!subTask.id || typeof window === undefined) return;
    window.open(` ${window.location.href}?taskId=${subTask.id}`, "_blank");
  };

  const submitComment = async (formData: CommentForm) => {
    await mutateAsync(formData as Partial<CreateCommentDto>);
  };

  if (!task) return <Fragment />;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-3 pt-3 pb-2">
        <h1 className="text-3xl capitalize px-0 m-0 mb-3 font-bold truncate text-foreground">
          {title ?? EMPTY_STRING}
        </h1>
      </div>
      <div className="px-3 grid grid-cols-2 gap-3 mb-4 shrink-0">
        {status && (
          <div className="flex items-center gap-3">
            <BaseLabel className="w-[72px]">Status:</BaseLabel>
            <Badge value={taskStatus.label} className="text-sm" color={taskStatus.color} />
          </div>
        )}
        {task?.storyPoint && (
          <div className="flex items-center gap-3">
            <BaseLabel className="w-[72px]">Estimation:</BaseLabel>
            <span className="text-foreground">{task?.storyPoint}</span>
          </div>
        )}
        {assignee && (
          <div className="flex items-center gap-3">
            <BaseLabel className="w-[72px]">Assignee</BaseLabel>
            <span className="text-foreground">{assignee.label}</span>
          </div>
        )}
        {sprint && (
          <div className="flex items-center gap-3">
            <BaseLabel className="w-[72px]">Sprint:</BaseLabel>
            <span className="text-foreground">{sprint.name}</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 mb-3">
        <BaseLabel>Description:</BaseLabel>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="text-foreground prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{description ?? EMPTY_STRING}</ReactMarkdown>
          </div>
        </Suspense>
      </div>
      {subTasks.length > 0 && (
        <div className="flex gap-3 w-full px-3 mb-3 shrink-0">
          <BaseLabel className="w-[72px]">Sub Tasks:</BaseLabel>
          <div className="grow max-h-40 overflow-auto">
            {subTasks.map((subTask: ObjectType) => (
              <TaskRow key={subTask.id} task={subTask} onSelect={selectSubTask(subTask)} active={false} />
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col px-3 pb-3 shrink-0 border-t pt-3">
        <BaseLabel className="mb-2">Comments:</BaseLabel>
        <div className="max-h-56 min-h-6 overflow-auto mb-3">
          {(comments as Comment[]).map((comment: Comment) => (
            <CommentRow key={String(comment.id)} comment={comment} />
          ))}
        </div>
        <CommentForm onSubmit={submitComment} />
      </div>
    </div>
  );
}
