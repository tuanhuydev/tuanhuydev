import Badge from "../commons/Badge";
import { TaskStatus, TaskStatusEnum, TaskType, TaskTypeEnum } from "@app/_utils/constants";
import { Button } from "@app/components/ui/button";
import StarOutlined from "@mui/icons-material/StarOutlined";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import React, { memo, useMemo } from "react";

export interface TaskRowProps {
  onSelect: (task: ObjectType) => void;
  onPin?: (task: ObjectType) => void;
  task: ObjectType;
  active: boolean;
  isToday?: boolean;
  showAssignee?: boolean;
}

const TaskRow = memo(function TaskRow({
  task,
  onSelect,
  onPin,
  active = false,
  isToday = false,
  showAssignee = false,
}: TaskRowProps) {
  const { id, title, type, status, assignee } = task;
  const taskStatus = TaskStatus[status as TaskStatusEnum] || TaskStatus.TODO;
  const taskType = TaskType[type as TaskTypeEnum] || TaskType.ISSUE;

  const selectTask = (event: { stopPropagation: () => void }) => {
    onSelect(task);
  };
  const pinTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (task && onPin) {
      onPin(task);
    }
  };

  const activeClass = active ? "bg-slate-200 dark:bg-gray-700" : "";
  const pinnedClass = isToday ? "!fill-yellow-400 stroke-yellow-500" : "!fill-transparent stroke-primary text-sm";

  const TaskTypeElement = useMemo(() => {
    const { label, icon } = taskType;
    return (
      <Tooltip title={label}>
        <div className={`flex items-center justify-center w-6 h-6 rounded-full  text-white dark:text-primary`}>
          <Image src={icon} width={24} height={24} alt="task type icon"></Image>
        </div>
      </Tooltip>
    );
  }, [taskType]);
  return (
    <div
      className={`flex flex-shrink-0 w-full items-center gap-5 p-1 mb-1 cursor-pointer transition-all duration-300 rounded-md ${activeClass} text-primary dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-700`}
      onClick={selectTask}>
      {TaskTypeElement}
      <h3 className="capitalize w-2/5 text-base flex items-center font-medium m-0 truncate">{title}</h3>
      <div className="flex items-center gap-3 shrink-0 w-56">
        <label className="text-sm font-normal text-slate-400 dark:text-slate-500">Status: </label>
        <Badge value={taskStatus.label} color={taskStatus.color} />
      </div>
      {showAssignee && (
        <div className="flex items-center gap-3 shrink-0 w-56">
          <label className="text-sm font-normal text-slate-400 dark:text-slate-500">Assignee: </label>
          <span className="truncate">{assignee?.name ?? "Unassigned"}</span>
        </div>
      )}
      <div className="ml-auto flex justify-end">
        {onPin && (
          <Button variant="ghost" size="icon" onClick={pinTask}>
            <StarOutlined className={`text-sm !w-4 !h-4 ${pinnedClass}`} />
          </Button>
        )}
      </div>
    </div>
  );
});

TaskRow.displayName = "TaskRow";
export default TaskRow;
