import Badge from "../commons/Badge";
import { Task } from "@prisma/client";
import React from "react";

export type TaskWithStatus = Task & { status: { name: string; color: string } };

export interface TaskRowProps {
  onView: (task: Task) => void;
  task: TaskWithStatus;
  active: boolean;
  projectId: number;
}

export default function TaskRow({ task, onView, active = false }: TaskRowProps) {
  const { id, title, status } = task;
  console.log(task);

  const handleView = () => {
    if (onView) onView(task);
  };

  const activeClass = active ? "bg-slate-100" : "";

  return (
    <div
      className={`flex w-full items-center p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} hover:bg-slate-100`}
      onClick={handleView}>
      <h3 className="capitalize w-[10rem] text-base font-medium m-0">
        [#{id}] {title}
      </h3>
      <Badge value={status.name} color={status.color} />
    </div>
  );
}
