"use client";

import Loader from "../commons/Loader";
import { formatDate } from "@app/_utils/helper";
import { useSprintQuery } from "@app/queries/sprintQueries";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type TaskGroupType = {
  [key: string]: Array<ObjectType>;
};

const TaskRow = dynamic(async () => (await import("./TaskRow")).default, {
  ssr: false,
});

const Empty = dynamic(async () => (await import("antd/es/empty")).default, {
  ssr: false,
});

export interface TaskListProps {
  tasks: ObjectType[];
  projectId?: string;
  isLoading: boolean;
  selectedTask: ObjectType | null;
  onSelectTask: (task: ObjectType) => void;
}

export default function TaskList({ tasks, projectId, onSelectTask, selectedTask, isLoading = false }: TaskListProps) {
  const queryClient = useQueryClient();
  const [taskGroups, setTaskGroups] = useState<TaskGroupType>({
    backlog: [],
  });

  const { data: projectSprints } = useSprintQuery(projectId as string);

  const todayTasks: Array<ObjectType> = queryClient.getQueryData(["todayTasks"]) || [];

  useEffect(() => {
    if (projectId) {
      const taskGroups: TaskGroupType = { backlog: [] };
      projectSprints?.forEach((sprint: ObjectType) => {
        taskGroups[sprint.id] = [];
      });

      tasks.forEach((task: ObjectType) => {
        if (!task?.sprintId) {
          taskGroups.backlog.push(task);
        }
        if (task.sprintId in taskGroups) {
          taskGroups[task.sprintId].push(task);
        }
      });
      setTaskGroups((prev) => ({ ...prev, ...taskGroups }));
    }
  }, [tasks, projectId, projectSprints]);

  const addTaskToToday = async (task: ObjectType) => {
    const taskExisted = todayTasks.some((todayTask: ObjectType) => todayTask.id === task.id);
    const newTodayTasks = taskExisted
      ? todayTasks.filter((todayTask: ObjectType) => todayTask.id !== task.id)
      : [...todayTasks, task];
    await queryClient.setQueryData(["todayTasks"], newTodayTasks);
  };

  if (!tasks?.length && !isLoading) return <Empty />;

  if (isLoading) return <Loader />;

  if (!projectId) {
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

  const keys = Object.keys(taskGroups);
  const sortedKeys = keys.filter((key) => key !== "backlog").concat("backlog");

  const TaskGroups = sortedKeys.map((key: string) => {
    const tasks = taskGroups[key];
    let sprintName = key;
    let startdate = "";
    let enddate = "";
    if (key !== "backlog") {
      const currentSprint = projectSprints.find((sprint: ObjectType) => sprint.id === key);
      sprintName = currentSprint?.name ?? key;
      startdate = currentSprint?.startDate ?? "";
      enddate = currentSprint?.endDate ?? "";
    }
    return (
      <div key={key} className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg m-0 capitalize font-semibold">{sprintName}</h2>
          {startdate && enddate && (
            <span className="text-xs text-gray-500">
              {formatDate(startdate)} - {formatDate(enddate)}
            </span>
          )}
        </div>
        {tasks.map((task: ObjectType) => {
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
        })}
      </div>
    );
  });

  return <div className="flex-1 overflow-y-auto overflow-x-hidden">{TaskGroups}</div>;
}
