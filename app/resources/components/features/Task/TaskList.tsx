"use client";

import Empty from "../../common/Empty";
import Loader from "../../common/Loader";
import { Sprint } from "@lib/types/sprint";
import { Task } from "@lib/types/task";
import { QUERY_KEYS } from "@resources/queries/queryKeys";
import { useSprintQuery } from "@resources/queries/sprintQueries";
import { useTodayTasks } from "@resources/queries/taskQueries";
import { formatDate } from "@resources/utils/helper";
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

export default function TaskList({ tasks, projectId, onSelectTask, selectedTask, isLoading = false }: TaskListProps) {
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  const [taskGroups, setTaskGroups] = useState<TaskGroupType>({ backlog: [] });
  const { data: projectSprints } = useSprintQuery(projectId as string);
  const { data: todayTasks = [] } = useTodayTasks();

  // Virtual scrolling for non-project tasks
  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 48, []),
    overscan: 5,
  });

  useEffect(() => {
    if (!projectId) return;

    const taskGroups: TaskGroupType = { backlog: [] };

    projectSprints?.forEach((sprint: Record<string, unknown>) => {
      taskGroups[sprint.id as string] = [];
    });

    tasks.forEach((task: Record<string, unknown>) => {
      if (task?.sprintId) {
        taskGroups[task.sprintId as string]?.push({ ...task, subTasks: [] } as unknown as Task);
      } else {
        taskGroups.backlog.push({ ...task, subTasks: [] } as unknown as Task);
      }
    });

    const groupedTasks: TaskGroupType = {};
    Object.entries(taskGroups).forEach(([key, sprintTasks]) => {
      groupedTasks[key] = sprintTasks.filter((task) => {
        if (task.parentId) {
          const parentTask = sprintTasks.find((t) => t.id === task.parentId);
          (parentTask?.subTasks as Record<string, unknown>[])?.push(task);
          return false;
        }
        return true;
      });
    });

    setTaskGroups(groupedTasks);
  }, [tasks, projectId, projectSprints]);

  const addTaskToToday = async (task: Task) => {
    const taskExisted = todayTasks.some((todayTask: Task) => todayTask.id === task.id);
    const newTodayTasks = taskExisted
      ? todayTasks.filter((todayTask: Task) => todayTask?.id !== task.id)
      : [...todayTasks, task];
    await queryClient.setQueryData([QUERY_KEYS.TODAY_TASKS], newTodayTasks);
  };

  if (!tasks.length && !isLoading) return <Empty />;
  if (isLoading) return <Loader />;

  if (!projectId) {
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
                  fallback={
                    <div className="h-[48px] w-full rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  }>
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

  const sortedKeys = Object.keys(taskGroups)
    .filter((key) => key !== "backlog")
    .concat("backlog");

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {sortedKeys.map((key) => {
        const tasks = taskGroups[key];
        let sprintName = key;
        let startDate = "";
        let endDate = "";

        if (key !== "backlog") {
          const currentSprint = (projectSprints as Sprint[])?.find(({ id }) => id === key);
          sprintName = (currentSprint?.name as string) ?? key;
          startDate = currentSprint?.startDate ? String(currentSprint.startDate) : "";
          endDate = currentSprint?.endDate ? String(currentSprint.endDate) : "";
        }

        return (
          <div key={key} className="mb-4">
            <div className="flex items-center gap-3 mb-2 min-h-[32px]">
              <h2 className="text-lg m-0 capitalize font-semibold text-gray-900 dark:text-gray-100">{sprintName}</h2>
              {startDate && endDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              )}
            </div>
            {tasks.map((task) => {
              const isTaskActive = selectedTask?.id === task.id;
              const isTaskToday = todayTasks.some((todayTask: Task) => todayTask.id === task.id);
              return (
                <div key={task.id}>
                  <Suspense
                    fallback={
                      <div className="h-[48px] w-full rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse mb-1" />
                    }>
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
                  {(task.subTasks as Task[])?.length > 0 && (
                    <div className="pl-3">
                      {(task.subTasks as Task[]).map((subTask: Task) => {
                        const isSubTaskActive = selectedTask?.id === subTask.id;
                        const isSubTaskToday = todayTasks.some((todayTask: Task) => todayTask.id === subTask.id);
                        return (
                          <Suspense
                            fallback={
                              <div className="h-[48px] w-full rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse mb-1" />
                            }
                            key={subTask.id}>
                            <TaskRow
                              task={subTask}
                              active={isSubTaskActive}
                              onSelect={onSelectTask}
                              onPin={(task) => {
                                void addTaskToToday(task);
                              }}
                              isToday={isSubTaskToday}
                            />
                          </Suspense>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
