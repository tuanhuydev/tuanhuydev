"use client";

import Badge from "../commons/Badge";
import BaseButton from "../commons/buttons/BaseButton";
import { EMPTY_STRING } from "@lib/configs/constants";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import dynamic from "next/dynamic";
import React, { Fragment, useMemo } from "react";

const WithTooltip = dynamic(async () => (await import("@components/commons/hocs/WithTooltip")).default, { ssr: false });

export interface TaskFormTitleProps {
  task: TaskStatusAssignee | null;
  mode: "VIEW" | "EDIT";
  allowEditTask?: boolean;
  allowDeleteTask?: boolean;
  onClose: (open: boolean) => void;
  onToggle: (mode: string) => void;
  onTriggerDelete?: () => void;
}

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

export default function TaskFormTitle({
  task,
  mode,
  allowEditTask = false,
  onClose,
  onTriggerDelete,
  onToggle,
}: TaskFormTitleProps) {
  const isViewMode = mode === "VIEW";
  const isEditMode = mode === "EDIT";

  const RenderHeaderExtra = useMemo(() => {
    const handleClose = () => onClose(false);

    const toggleMode = (mode: string) => () => {
      onToggle(mode as "VIEW" | "EDIT");
    };

    return (
      <div className="px-2 flex gap-2 items-center relative">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <BaseButton
                onClick={toggleMode(COMPONENT_MODE.EDIT)}
                icon={<EditOutlined className="!text-lg text-slate-50" />}
              />
            )}
            {isEditMode && (
              <BaseButton
                onClick={toggleMode(COMPONENT_MODE.VIEW)}
                icon={<EditOffOutlined className="!text-lg text-slate-50" />}
              />
            )}
          </Fragment>
        )}
        <BaseButton
          className="border-r-2 border-red-400"
          onClick={onTriggerDelete}
          icon={<DeleteOutlined className="text-slate-50 !text-lg" />}
        />
        <BaseButton onClick={handleClose} icon={<CloseOutlined className="!text-lg text-white" />} />
      </div>
    );
  }, [allowEditTask, isEditMode, isViewMode, onClose, onToggle, onTriggerDelete]);

  const RenderTitle = useMemo(() => {
    const TitleStyles = "my-0 mr-3 px-3 py-2 bg-primary text-white text-base";
    if (!task) return <h1 className={TitleStyles}>Create new task</h1>;
    const { id, status } = task;
    return (
      <div className="flex items-baseline">
        <WithTooltip content={`${window.location.href}?taskId=${id}`} title="Copy task link">
          <h1 className={`${TitleStyles} hover:underline`}>{`Task #${id}`}</h1>
        </WithTooltip>
        {status && isViewMode && <Badge color={status?.color ?? "transparent"} value={status?.name ?? EMPTY_STRING} />}
      </div>
    );
  }, [isViewMode, task]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between">
      {RenderTitle}
      {RenderHeaderExtra}
    </div>
  );
}
