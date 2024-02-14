"use client";

import Loader from "../commons/Loader";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import { getLocalStorage, setLocalStorage } from "@lib/shared/utils/dom";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const TaskRow = dynamic(async () => (await import("./TaskRow")).default, {
  ssr: false,
});

const Empty = dynamic(async () => (await import("antd/es/empty")).default, {
  ssr: false,
});

export interface TaskListProps {
  tasks: TaskStatusAssignee[];
  isLoading: boolean;
  selectedTask: TaskStatusAssignee | null;
  onSelectTask: (task: TaskStatusAssignee) => void;
}

export default function TaskList({ tasks, onSelectTask, selectedTask, isLoading = false }: TaskListProps) {
  const [todayTasks, setTodayTasks] = useState<TaskStatusAssignee[]>(getLocalStorage("todayTasks") ?? []);

  const addTaskToToday = (task: TaskStatusAssignee) => {
    const taskExisted = todayTasks.some((todayTask: TaskStatusAssignee) => todayTask.id === task.id);
    const newTodayTasks = taskExisted
      ? todayTasks.filter((todayTask: TaskStatusAssignee) => todayTask.id !== task.id)
      : [...todayTasks, task];
    setTodayTasks(newTodayTasks);
  };

  useEffect(() => {
    if (todayTasks.length) {
      setLocalStorage("todayTasks", JSON.stringify(todayTasks));
    }
  }, [todayTasks]);

  if (!tasks?.length && !isLoading) return <Empty />;

  if (isLoading) return <Loader />;

  return tasks.map((task: TaskStatusAssignee) => {
    const isTaskActive = selectedTask?.id === task.id;
    const isTaskToday = todayTasks.some((todayTask: TaskStatusAssignee) => todayTask.id === task.id);

    return (
      <TaskRow
        key={task.id}
        task={task as TaskStatusAssignee}
        active={isTaskActive}
        onSelect={onSelectTask}
        onPin={addTaskToToday}
        isToday={isTaskToday}
      />
    );
  });
}
