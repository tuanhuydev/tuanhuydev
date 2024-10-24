"use client";

import Empty from "../commons/Empty";
import Loader from "../commons/Loader";
import { formatDate } from "@app/_utils/helper";
import { useSprintQuery } from "@app/queries/sprintQueries";
import { useTodayTasks } from "@app/queries/taskQueries";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type TaskGroupType = {
  [key: string]: ObjectType[];
};

const TaskRow = dynamic(() => import("./TaskRow"), { ssr: false });

export interface TaskListProps {
  tasks: ObjectType[];
  projectId?: string;
  isLoading: boolean;
  selectedTask: ObjectType | null;
  onSelectTask: (task: ObjectType) => void;
}

export default function TaskList({ tasks, projectId, onSelectTask, selectedTask, isLoading = false }: TaskListProps) {
  const queryClient = useQueryClient();
  const [taskGroups, setTaskGroups] = useState<TaskGroupType>({ backlog: [] });
  const { data: projectSprints } = useSprintQuery(projectId as string);
  const { data: todayTasks = [] } = useTodayTasks();

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
    await queryClient.setQueryData(["todayTasks"], newTodayTasks);
  };

  if (!tasks.length && !isLoading) return <Empty />;
  if (isLoading) return <Loader />;

  if (!projectId) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {tasks.map((task) => {
          const isTaskActive = selectedTask?.id === task.id;
          const isTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask?.id === task.id);
          return (
            <TaskRow
              key={task.id}
              task={task}
              active={isTaskActive}
              onSelect={onSelectTask}
              onPin={addTaskToToday}
              isToday={isTaskToday}
            />
          );
        })}
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
              <h2 className="text-lg m-0 capitalize font-semibold">{sprintName}</h2>
              {startDate && endDate && (
                <span className="text-xs text-gray-500">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              )}
            </div>
            {tasks.map((task) => {
              const isTaskActive = selectedTask?.id === task.id;
              const isTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask.id === task.id);
              return (
                <div key={task.id}>
                  <TaskRow
                    task={task}
                    active={isTaskActive}
                    onSelect={onSelectTask}
                    onPin={addTaskToToday}
                    isToday={isTaskToday}
                  />
                  {task.subTasks?.length > 0 && (
                    <div className="pl-3">
                      {task.subTasks.map((subTask: ObjectType) => {
                        const isSubTaskActive = selectedTask?.id === subTask.id;
                        const isSubTaskToday = todayTasks.some((todayTask: ObjectType) => todayTask.id === subTask.id);
                        return (
                          <TaskRow
                            key={subTask.id}
                            task={subTask}
                            active={isSubTaskActive}
                            onSelect={onSelectTask}
                            onPin={addTaskToToday}
                            isToday={isSubTaskToday}
                          />
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
