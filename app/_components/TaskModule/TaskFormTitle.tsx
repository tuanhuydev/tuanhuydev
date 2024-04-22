"use client";

import Badge from "../commons/Badge";
import BaseButton from "../commons/buttons/BaseButton";
import ConfirmBox from "../commons/modals/ConfirmBox";
import { TaskStatus, TaskStatusEnum } from "@app/_configs/constants";
import { useDeleteTaskMutation } from "@app/queries/taskQueries";
import LogService from "@lib/services/LogService";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { notification } from "antd";
import dynamic from "next/dynamic";
import React, { Fragment, useCallback, useMemo, useState } from "react";

const WithTooltip = dynamic(async () => (await import("@components/commons/hocs/WithTooltip")).default, { ssr: false });

export interface TaskFormTitleProps {
  task: ObjectType | null;
  mode: "VIEW" | "EDIT";
  allowEditTask?: boolean;
  allowDeleteTask?: boolean;
  onClose: (open: boolean) => void;
  onToggle: (mode: string) => void;
}

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

export default function TaskFormTitle({ task, mode, allowEditTask = false, onClose, onToggle }: TaskFormTitleProps) {
  const { mutateAsync: deleteTaskMutation } = useDeleteTaskMutation();

  const isViewMode = mode === "VIEW";
  const isEditMode = mode === "EDIT";
  const hasTask = !!task;

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const toggleConfirm = useCallback((open: boolean) => () => setOpenConfirm(open), [setOpenConfirm]);

  const handleClose = useCallback(() => onClose(false), [onClose]);

  const toggleMode = useCallback(
    (mode: string) => () => {
      onToggle(mode as "VIEW" | "EDIT");
    },
    [onToggle],
  );
  const handleDelete = useCallback(async () => {
    try {
      await deleteTaskMutation((task as ObjectType).id.toString());
      notification.success({ message: "Task deleted successfully" });
    } catch (error) {
      LogService.log(error);
    } finally {
      onClose(false);
      setOpenConfirm(false);
    }
  }, [deleteTaskMutation, onClose, task]);

  const RenderHeaderExtra = useMemo(() => {
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
        {hasTask && (
          <BaseButton
            className="border-r-2 border-red-400"
            onClick={toggleConfirm(true)}
            icon={<DeleteOutlined className="text-slate-50 !text-lg" />}
          />
        )}
        <BaseButton onClick={handleClose} icon={<CloseOutlined className="!text-lg text-white" />} />
      </div>
    );
  }, [allowEditTask, handleClose, hasTask, isEditMode, isViewMode, toggleConfirm, toggleMode]);

  const RenderTitle = useMemo(() => {
    const TitleStyles = "my-0 mr-3 px-3 py-2 bg-primary text-white text-base";
    if (!task) return <h1 className={TitleStyles}>Create new task</h1>;
    const { id, status } = task;
    const taskStatus = TaskStatus[status as TaskStatusEnum] || TaskStatus.TODO;

    return (
      <div className="flex items-baseline">
        <WithTooltip content={`${window.location.href}?taskId=${id}`} title="Copy task link">
          <h1 className={`${TitleStyles} hover:underline`}>{`Task #${id}`}</h1>
        </WithTooltip>
        {status && isViewMode && <Badge value={taskStatus.label} color={taskStatus.color} />}
      </div>
    );
  }, [isViewMode, task]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between">
      {RenderTitle}
      {RenderHeaderExtra}
      <ConfirmBox
        open={openConfirm}
        title="Delete Task"
        description="Are you sure to delete this task ?"
        onClose={toggleConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
