"use client";

import Badge from "../commons/Badge";
import { EMPTY_STRING } from "@lib/configs/constants";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import Button from "antd/es/button";
import dynamic from "next/dynamic";
import React, { Fragment, useMemo } from "react";

const WithTooltip = dynamic(async () => (await import("@components/commons/hocs/WithTooltip")).default, { ssr: false });

export interface TaskFormTitleProps {
  task: TaskStatusAssignee | null;
  mode: "VIEW" | "EDIT";
  allowEditTask: boolean;
  onClose: (open: boolean) => void;
  onToggle: (mode: string) => void;
}

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

export default function TaskFormTitle({ task, mode, allowEditTask = false, onClose, onToggle }: TaskFormTitleProps) {
  const isViewMode = mode === "VIEW";
  const isEditMode = mode === "EDIT";

  const RenderHeaderExtra = useMemo(() => {
    const handleClose = () => onClose(false);

    const toggleMode = (mode: string) => () => {
      onToggle(mode as "VIEW" | "EDIT");
    };

    return (
      <div className="px-2 flex items-center">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <Button
                type="link"
                onClick={toggleMode(COMPONENT_MODE.EDIT)}
                className="!leading-none"
                icon={<EditOutlined className="!text-lg text-white" />}
              />
            )}
            {isEditMode && (
              <Button
                type="link"
                className="!leading-none"
                onClick={toggleMode(COMPONENT_MODE.VIEW)}
                icon={<EditOffOutlined className="!text-lg text-white" />}
              />
            )}
          </Fragment>
        )}
        <Button
          type="primary"
          onClick={handleClose}
          className="!leading-none"
          icon={<CloseOutlined className="!text-lg text-white" />}
        />
      </div>
    );
  }, [allowEditTask, isEditMode, isViewMode, onClose, onToggle]);

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
