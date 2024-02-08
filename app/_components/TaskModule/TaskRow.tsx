import Badge from "../commons/Badge";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import React from "react";

export interface TaskRowProps {
  onSelect: (task: TaskStatusAssignee) => void;
  task: TaskStatusAssignee;
  active: boolean;
  showAssignee?: boolean;
}

export default function TaskRow({ task, onSelect, active = false, showAssignee = false }: TaskRowProps) {
  const { id, title, status, assignee } = task;

  const handleSelect = () => onSelect(task);

  const activeClass = active ? "bg-slate-100 dark:bg-gray-700" : "";

  return (
    <div
      className={`flex w-full items-center gap-5 p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} text-primary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700`}
      onClick={handleSelect}>
      <h3 className="capitalize w-2/5 text-base font-medium m-0">
        [#{id}] {title}
      </h3>
      <div className="flex items-center gap-3 shrink-0 w-44">
        <label className="text-sm font-normal text-slate-300">Status: </label>
        <Badge value={status.name} color={status.color} />
      </div>
      {showAssignee && (
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-sm font-normal text-slate-300">Assignee: </label>
          <span>{assignee?.name ?? "Unassigned"}</span>
        </div>
      )}
    </div>
  );
}
