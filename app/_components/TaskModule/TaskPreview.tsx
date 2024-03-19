"use client";

import BaseLabel from "../commons/BaseLabel";
import { EMPTY_STRING } from "@lib/configs/constants";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";

export interface TaskPreviewProps {
  task: TaskStatusAssignee | null;
}
export default function TaskPreview({ task }: TaskPreviewProps) {
  if (!task) return <Fragment />;

  const { title, description, assignee } = task;
  return (
    <div className="p-3">
      <h1 className="text-3xl capitalize px-0 m-0 mb-2 font-bold truncate">{title ?? EMPTY_STRING}</h1>
      <div className="flex items-center gap-3 mb-2 text-base">
        <BaseLabel>Assignee</BaseLabel>
        {assignee?.name ?? "Unassigned"}
      </div>
      <div className="mt-4 text-base">
        <ReactMarkdown>{description ?? EMPTY_STRING}</ReactMarkdown>
      </div>
    </div>
  );
}
