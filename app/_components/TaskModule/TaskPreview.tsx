import Badge from "../commons/Badge";
import BaseLabel from "../commons/BaseLabel";
import { TaskStatus, TaskStatusEnum } from "@app/_configs/constants";
import { EMPTY_STRING } from "@lib/configs/constants";
import dynamic from "next/dynamic";
import React, { Fragment } from "react";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

export interface TaskPreviewProps {
  task: ObjectType | null;
  assignee?: SelectOption | null;
  sprint?: ObjectType | null;
}
export default function TaskPreview({ task, assignee, sprint }: TaskPreviewProps) {
  if (!task) return <Fragment />;
  const { title, description, status } = task;
  const taskStatus = TaskStatus[status as TaskStatusEnum] || TaskStatus.TODO;
  return (
    <div className="p-3">
      <h1 className="text-3xl capitalize px-0 m-0 mb-3 font-bold truncate">{title ?? EMPTY_STRING}</h1>
      {status && (
        <div className="flex items-center gap-3 mb-2 text-base">
          <BaseLabel>Status</BaseLabel>
          <Badge value={taskStatus.label} className="text-sm" color={taskStatus.color} />
        </div>
      )}
      {assignee && (
        <div className="flex items-center gap-3 mb-2 text-base">
          <BaseLabel>Assignee</BaseLabel>
          {assignee.label}
        </div>
      )}
      {sprint && (
        <div className="flex items-center gap-3 mb-2 text-base">
          <BaseLabel>Sprint</BaseLabel>
          {sprint.name}
        </div>
      )}

      <BaseLabel>Description</BaseLabel>
      <div className="mb-3">
        <ReactMarkdown>{description ?? EMPTY_STRING}</ReactMarkdown>
      </div>
    </div>
  );
}
