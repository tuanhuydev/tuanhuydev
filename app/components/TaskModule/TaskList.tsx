"use client";

import Empty from "../commons/Empty";
import Loader from "../commons/Loader";
import { QUERY_KEYS } from "@app/_queries/queryKeys";
import { useSprintQuery } from "@app/_queries/sprintQueries";
import { useTodayTasks } from "@app/_queries/taskQueries";
import { formatDate } from "@app/_utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";

type TaskGroupType = {
  [key: string]: ObjectType[];
};

// Replace dynamic import with React lazy
const TaskRow = lazy(() => import("./TaskRow"));

export interface TaskListProps {
  tasks: Task[];
  projectId?: string;
  isLoading: boolean;
  selectedTask: ObjectType | null;
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
    projectSprints?.forEach((sprint: ObjectType) => {
      taskGroups[sprint.id] = [];
    });

    tasks.forEach((task: ObjectType) => {
      if (task?.sprintId) {
        taskGroups[task.sprintId]?.push({ ...task, subTasks: [] });
      } else {
        taskGroups.backlog.push({ ...task, subTasks: [] });
      }
    });

    const groupedTasks: TaskGroupType = {};
    Object.entries(taskGroups).forEach(([key, sprintTasks]) => {
      groupedTasks[key] = sprintTasks.filter((task) => {
        if (task.parentId) {
          const parentTask = sprintTasks.find((t) => t.id === task.parentId);
          parentTask?.subTasks.push(task);
          return false;
        }
        return true;
      });
    });

    setTaskGroups(groupedTasks);
  }, [tasks, projectId, projectSprints]);

  const addTaskToToday = async (task: ObjectType) => {
    const taskExisted = todayTasks.some((todayTask: ObjectType) => todayTask.id === task.id);
    const newTodayTasks = taskExisted
      ? todayTasks.filter((todayTask: ObjectType) => todayTask?.id !== task.id)
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
            const isTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask?.id === task.id);
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
                <Suspense fallback={<Loader />}>
                  <TaskRow
                    task={task}
                    active={isTaskActive}
                    onSelect={onSelectTask as any}
                    onPin={addTaskToToday}
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
          const currentSprint = projectSprints?.find((sprint: ObjectType) => sprint.id === key);
          sprintName = currentSprint?.name ?? key;
          startDate = currentSprint?.startDate ?? "";
          endDate = currentSprint?.endDate ?? "";
        }

        return (
          <div key={key} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg m-0 capitalize font-semibold text-gray-900 dark:text-gray-100">{sprintName}</h2>
              {startDate && endDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              )}
            </div>
            {tasks.map((task) => {
              const isTaskActive = selectedTask?.id === task.id;
              const isTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask.id === task.id);
              return (
                <div key={task.id}>
                  <Suspense fallback={<Loader />}>
                    <TaskRow
                      task={task}
                      active={isTaskActive}
                      onSelect={onSelectTask as any}
                      onPin={addTaskToToday}
                      isToday={isTaskToday}
                    />
                  </Suspense>
                  {task.subTasks?.length > 0 && (
                    <div className="pl-3">
                      {task.subTasks.map((subTask: ObjectType) => {
                        const isSubTaskActive = selectedTask?.id === subTask.id;
                        const isSubTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask.id === subTask.id);
                        return (
                          <Suspense fallback={<Loader />} key={subTask.id}>
                            <TaskRow
                              task={subTask}
                              active={isSubTaskActive}
                              onSelect={onSelectTask as any}
                              onPin={addTaskToToday}
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
