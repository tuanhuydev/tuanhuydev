import { Task } from "@prisma/client";
import React from "react";

export interface TaskRowProps {
  onView: (task: Task) => void;
  task: Task;
  active: boolean;
  projectId: number;
}

export default function TaskRow({ task, onView, active = false }: TaskRowProps) {
  const { id, title } = task;

  const handleView = () => {
    if (onView) onView(task);
  };

  const activeClass = active ? "bg-slate-100" : "";

  return (
    <div
      className={`flex w-full items-center justify-between p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} hover:bg-slate-100`}
      onClick={handleView}>
      <h3 className="capitalize grow text-base font-normal m-0">
        [#{id}] {title}
      </h3>
    </div>
  );
}
