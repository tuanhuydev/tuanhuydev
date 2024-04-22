"use client";

import Loader from "../commons/Loader";
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
  tasks: ObjectType[];
  isLoading: boolean;
  selectedTask: ObjectType | null;
  onSelectTask: (task: ObjectType) => void;
}

export default function TaskList({ tasks, onSelectTask, selectedTask, isLoading = false }: TaskListProps) {
  const [todayTasks, setTodayTasks] = useState<ObjectType[]>(getLocalStorage("todayTasks") ?? []);

  const addTaskToToday = (task: ObjectType) => {
    const taskExisted = todayTasks.some((todayTask: ObjectType) => todayTask.id === task.id);
    const newTodayTasks = taskExisted
      ? todayTasks.filter((todayTask: ObjectType) => todayTask.id !== task.id)
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

  const TaskRows = tasks.map((task: ObjectType) => {
    const isTaskActive = selectedTask?.id === task.id;
    const isTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask.id === task.id);

    return (
      <TaskRow
        key={task.id}
        task={task as ObjectType}
        active={isTaskActive}
        onSelect={onSelectTask}
        onPin={addTaskToToday}
        isToday={isTaskToday}
      />
    );
  });
  return <div className="flex-1 overflow-y-auto overflow-x-hidden">{TaskRows}</div>;
}
