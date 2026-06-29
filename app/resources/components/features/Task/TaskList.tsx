"use client";

import Empty from "../../common/Empty";
import Loader from "../../common/Loader";
import { Task } from "@lib/types/task";
import { QUERY_KEYS } from "@resources/queries/queryKeys";
import { useTodayTasks } from "@resources/queries/taskQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";

type TaskGroupType = {
  [key: string]: Task[];
};

// Replace dynamic import with React lazy
const TaskRow = lazy(() => import("./TaskRow"));

export interface TaskListProps {
  tasks: Task[];
  projectId?: string;
  isLoading: boolean;
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
}

export default function TaskList({ tasks, onSelectTask, selectedTask, isLoading = false }: TaskListProps) {
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  const [_, setTaskGroups] = useState<TaskGroupType>({ backlog: [] });
  const { data: todayTasks = [] } = useTodayTasks();

  // Virtual scrolling for non-project tasks
  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 48, []),
    overscan: 5,
  });

  // Build task hierarchy (removed sprint grouping)
  useEffect(() => {
    const taskGroups: TaskGroupType = { backlog: [] };

    tasks.forEach((task: Record<string, unknown>) => {
      taskGroups.backlog.push({ ...task, subTasks: [] } as unknown as Task);
    });

    const groupedTasks: TaskGroupType = {};
    Object.entries(taskGroups).forEach(([key, groupTasks]) => {
      groupedTasks[key] = groupTasks.filter((task) => {
        if (task.parentId) {
          const parentTask = groupTasks.find((t) => t.id === task.parentId);
          (parentTask?.subTasks as Record<string, unknown>[])?.push(task);
          return false;
        }
        return true;
      });
    });

    setTaskGroups(groupedTasks);
  }, [tasks]);

  const addTaskToToday = async (task: Task) => {
    const taskExisted = todayTasks.some((todayTask: Task) => todayTask.id === task.id);
    const newTodayTasks = taskExisted
      ? todayTasks.filter((todayTask: Task) => todayTask?.id !== task.id)
      : [...todayTasks, task];
    await queryClient.setQueryData([QUERY_KEYS.TODAY_TASKS], newTodayTasks);
  };

  if (!tasks.length && !isLoading) return <Empty />;
  if (isLoading) return <Loader />;

  // Use virtual scrolling for all tasks
  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto overflow-x-hidden">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const task = tasks[virtualRow.index];
          const isTaskActive = selectedTask?.id === task.id;
          const isTaskToday = todayTasks.some((todayTask: Record<string, unknown>) => todayTask?.id === task.id);
          return (
            <div
              key={task.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}>
              <Suspense
                fallback={<div className="h-[48px] w-full rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
                <TaskRow
                  task={task}
                  active={isTaskActive}
                  onSelect={onSelectTask}
                  onPin={(task) => {
                    void addTaskToToday(task);
                  }}
                  isToday={isTaskToday}
                />
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
}
