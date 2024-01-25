import Badge from "../commons/Badge";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import React from "react";

export interface TaskRowProps {
  onView: (task: TaskStatusAssignee) => void;
  task: TaskStatusAssignee;
  active: boolean;
  projectId: number;
}

export default function TaskRow({ task, onView, active = false }: TaskRowProps) {
  const { id, title, status, assignee } = task;

  const handleView = () => {
    if (onView) onView(task);
  };

  const activeClass = active ? "bg-slate-100" : "";

  return (
    <div
      className={`flex w-full items-center gap-5 p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} hover:bg-slate-100`}
      onClick={handleView}>
      <h3 className="capitalize w-2/5 text-base font-medium m-0">
        [#{id}] {title}
      </h3>
      <div className="flex items-center gap-3 shrink-0 w-44">
        <label className="text-sm font-normal text-slate-300">Status: </label>
        <Badge value={status.name} color={status.color} />
      </div>
      {assignee && (
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-sm font-normal text-slate-300">Assignee: </label>
          <span>{assignee.name}</span>
        </div>
      )}
    </div>
  );
}
