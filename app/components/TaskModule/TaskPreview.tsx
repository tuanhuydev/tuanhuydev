import TaskRow from "./TaskRow";
import { TaskStatus, TaskStatusEnum } from "@app/_utils/constants";
import Badge from "@app/components/commons/Badge";
import BaseLabel from "@app/components/commons/BaseLabel";
import { useSubTasks } from "@app/queries/taskQueries";
import { EMPTY_STRING } from "lib/commons/constants/base";
import dynamic from "next/dynamic";
import { Fragment } from "react";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

export interface TaskPreviewProps {
  task: ObjectType | null;
  assignee?: SelectOptionType | null;
  sprint?: ObjectType | null;
}
export default function TaskPreview({ task, assignee, sprint }: TaskPreviewProps) {
  const { data: subTasks = [] } = useSubTasks(task?.id || "");

  const { title = "", description = "", status = "" } = task || {};
  const taskStatus = TaskStatus[status as TaskStatusEnum] || TaskStatus.TODO;

  const selectSubTask = (subTask: ObjectType) => () => {
    window.open(` ${window.location.href}?taskId=${subTask.id}`, "_blank");
  };

  if (!task) return <Fragment />;

  return (
    <div className="p-3 bg-transparent w-full">
      <h1 className="text-3xl capitalize px-0 m-0 mb-3 font-bold truncate">{title ?? EMPTY_STRING}</h1>
      {status && (
        <div className="flex items-center gap-3 mb-2 text-base">
          <BaseLabel>Status</BaseLabel>
          <Badge value={taskStatus.label} className="text-sm" color={taskStatus.color} />
        </div>
      )}
      {assignee && (
        <div className="flex gap-3 mb-2 text-base">
          <BaseLabel>Assignee</BaseLabel>
          {assignee.label}
        </div>
      )}
      {sprint && (
        <div className="flex gap-3 mb-2 text-base">
          <BaseLabel>Sprint</BaseLabel>
          {sprint.name}
        </div>
      )}
      {subTasks.length > 0 && (
        <div className="flex gap-3 mb-2 text-base w-full">
          <BaseLabel>Sub Tasks</BaseLabel>
          <div className="grow h-30 overflow-auto">
            {subTasks.map((subTask: ObjectType) => (
              <TaskRow key={subTask.id} task={subTask} onSelect={selectSubTask(subTask)} active={false} />
            ))}
          </div>
        </div>
      )}

      <BaseLabel>Description</BaseLabel>
      <div className="mb-3">
        <ReactMarkdown>{description ?? EMPTY_STRING}</ReactMarkdown>
      </div>
    </div>
  );
}
