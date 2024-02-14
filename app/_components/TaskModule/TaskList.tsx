import TaskRow from "./TaskRow";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import { Empty } from "antd";
import React from "react";

export interface TaskListProps {
  tasks: TaskStatusAssignee[];
  selectedTask: TaskStatusAssignee | null;
  onSelectTask: (task: TaskStatusAssignee) => void;
}

export default function TaskList({ tasks, onSelectTask, selectedTask }: TaskListProps) {
  if (!tasks?.length) return <Empty />;

  return tasks.map((task: TaskStatusAssignee) => {
    const isTaskActive = selectedTask?.id === task.id;
    return <TaskRow key={task.id} task={task as TaskStatusAssignee} active={isTaskActive} onSelect={onSelectTask} />;
  });
}
