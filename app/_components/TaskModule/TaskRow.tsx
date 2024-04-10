import Badge from "../commons/Badge";
import Button from "../commons/buttons/BaseButton";
import WithTooltip from "../commons/hocs/WithTooltip";
import bugImageSrc from "@app/_assets/images/icons/bug.svg";
import epicImageSrc from "@app/_assets/images/icons/epic.svg";
import issueImageSrc from "@app/_assets/images/icons/issue.svg";
import storyImageSrc from "@app/_assets/images/icons/story.svg";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import StarOutlined from "@mui/icons-material/StarOutlined";
import { Tooltip } from "antd";
import Image from "next/image";
import React, { useMemo } from "react";

export interface TaskRowProps {
  onSelect: (task: TaskStatusAssignee) => void;
  onPin?: (task: TaskStatusAssignee) => void;
  task: TaskStatusAssignee;
  active: boolean;
  isToday?: boolean;
  showAssignee?: boolean;
}

const TaskType = {
  BUG: "BUG",
  ISSUE: "ISSUE",
  EPIC: "EPIC",
  STORY: "STORY",
};

const TaskTypeIcon = {
  [TaskType.BUG]: {
    icon: bugImageSrc,
    tooltip: "Bug",
  },
  [TaskType.ISSUE]: {
    icon: issueImageSrc,
    tooltip: "Issue",
  },
  [TaskType.STORY]: {
    icon: storyImageSrc,
    tooltip: "Story",
  },
  [TaskType.EPIC]: {
    icon: epicImageSrc,
    tooltip: "Epic",
  },
};

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
  const TaskTypeElement = useMemo(() => {
    const { tooltip, icon } = TaskTypeIcon[task.type] ?? TaskTypeIcon[TaskType.ISSUE];
    return (
      <Tooltip title={tooltip}>
        <div className={`flex items-center justify-center w-6 h-6 rounded-full  text-white dark:text-primary`}>
          <Image src={icon} width={24} height={24} alt="task type icon"></Image>
        </div>
      </Tooltip>
    );
  }, [task?.type]);
  return (
    <div
      className={`flex flex-shrink-0 w-full items-center gap-5 p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} text-primary dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-700`}
      onClick={selectTask}>
      {TaskTypeElement}
      <h3 className="capitalize w-2/5 text-base flex items-center font-medium m-0 flex-shrink-0 truncate">
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
