import Badge from "../commons/Badge";
import Button from "../commons/buttons/BaseButton";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import StarOutlined from "@mui/icons-material/StarOutlined";
import React from "react";

export interface TaskRowProps {
  onSelect: (task: TaskStatusAssignee) => void;
  onPin?: (task: TaskStatusAssignee) => void;
  task: TaskStatusAssignee;
  active: boolean;
  isToday?: boolean;
  showAssignee?: boolean;
}

export default function TaskRow({
  task,
  onSelect,
  onPin,
  active = false,
  isToday = false,
  showAssignee = false,
}: TaskRowProps) {
  const { id, title, status, assignee } = task;

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

  return (
    <div
      className={`flex flex-shrink-0 w-full items-center gap-5 p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} text-primary dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-700`}
      onClick={selectTask}>
      <h3 className="capitalize w-2/5 text-base font-medium m-0 flex-shrink-0 truncate">
        [#{id}] {title}
      </h3>
      <div className="flex items-center gap-3 shrink-0 w-56">
        <label className="text-sm font-normal text-slate-400">Status: </label>
        <Badge value={status.name} color={status.color} />
      </div>
      {showAssignee && (
        <div className="flex items-center gap-3 shrink-0 w-56">
          <label className="text-sm font-normal text-slate-400">Assignee: </label>
          <span className="truncate">{assignee?.name ?? "Unassigned"}</span>
        </div>
      )}

      <div className="ml-auto flex justify-end">
        {onPin && (
          <Button
            variants="text"
            onClick={pinTask}
            icon={<StarOutlined className={`text-sm !w-4 !h-4 ${pinnedClass}`} />}
          />
        )}
      </div>
    </div>
  );
}
