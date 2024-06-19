"use client";

import { useSprintQuery } from "@app/queries/sprintQueries";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@app/queries/taskQueries";
import BaseButton from "@components/commons/buttons/BaseButton";
import LogService from "@lib/services/LogService";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LowPriorityOutlined from "@mui/icons-material/LowPriorityOutlined";
import { Select, notification } from "antd";
import dynamic from "next/dynamic";
import { Fragment, useCallback, useMemo, useState } from "react";

const BaseMenu = dynamic(() => import("@components/commons/BaseMenu"), { ssr: false });

const BaseModal = dynamic(() => import("@components/commons/modals/BaseModal"), { ssr: false });

const WithTooltip = dynamic(async () => (await import("@components/commons/hocs/WithTooltip")).default, { ssr: false });

const ConfirmBox = dynamic(() => import("@components/commons/modals/ConfirmBox"), { ssr: false });

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
  // Hooks
  const { mutateAsync: deleteTaskMutation } = useDeleteTaskMutation();
  const { mutateAsync: moveSprintMutation } = useUpdateTaskMutation();
  const { data: projectSprints = [] } = useSprintQuery(task?.projectId || "", { status: "ACTIVE" });

  // States
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openMoveToSprint, setOpenMoveToSprint] = useState<boolean>(false);
  const [sprintIdToUpdate, setSprintIdToUpdate] = useState<string>("");

  // Constants
  const isViewMode = mode === "VIEW";
  const isEditMode = mode === "EDIT";

  const toggleConfirmDelete = useCallback((open: boolean) => () => setOpenConfirmDelete(open), [setOpenConfirmDelete]);

  const toggleMode = useCallback(
    (mode: string) => () => {
      onToggle(mode as "VIEW" | "EDIT");
    },
    [onToggle],
  );

  const toggleMoveToSprint = useCallback((open: boolean) => () => setOpenMoveToSprint(open), [setOpenMoveToSprint]);

  const handleClose = useCallback(() => onClose(false), [onClose]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteTaskMutation((task as ObjectType).id.toString());
      notification.success({ message: "Task deleted successfully" });
    } catch (error) {
      LogService.log(error);
    } finally {
      onClose(false);
      setOpenConfirmDelete(false);
    }
  }, [deleteTaskMutation, onClose, task]);

  const handleMoveToSprint = useCallback(async () => {
    if (!sprintIdToUpdate) return;
    try {
      await moveSprintMutation({ ...task, sprintId: sprintIdToUpdate });
      notification.success({ message: "Task moved to sprint successfully" });
    } catch (error) {
      notification.error({ message: "Failed to move task to sprint" });
    } finally {
      setOpenMoveToSprint(false);
    }
  }, [moveSprintMutation, sprintIdToUpdate, task]);

  const RenderHeaderExtra = useMemo(() => {
    const existingTask = !!task;
    return (
      <div className="px-2 flex gap-2 items-center relative">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <BaseButton
                onClick={toggleMode(COMPONENT_MODE.EDIT)}
                icon={<EditOutlined className="text-slate-50" fontSize="small" />}
              />
            )}
            {isEditMode && (
              <BaseButton
                onClick={toggleMode(COMPONENT_MODE.VIEW)}
                icon={<EditOffOutlined className=" text-slate-50" fontSize="small" />}
              />
            )}
          </Fragment>
        )}
        {existingTask && (
          <Fragment>
            <BaseMenu
              items={[
                {
                  label: "Move to sprint",
                  icon: <LowPriorityOutlined fontSize="small" />,
                  onClick: toggleMoveToSprint(true),
                },
                {
                  label: "Delete task",
                  icon: <DeleteOutlined fontSize="small" />,
                  onClick: toggleConfirmDelete(true),
                },
              ]}
            />
          </Fragment>
        )}
        <BaseButton onClick={handleClose} icon={<CloseOutlined className="!text-lg text-white" />} />
      </div>
    );
  }, [allowEditTask, handleClose, isEditMode, isViewMode, task, toggleConfirmDelete, toggleMode, toggleMoveToSprint]);

  const RenderTitle = useMemo(() => {
    const TitleStyles = "my-0 mr-3 px-3 py-2 bg-primary text-white text-base";
    if (!task) return <h1 className={TitleStyles}>Create new task</h1>;
    const { id } = task;

    return (
      <WithTooltip content={`${window.location.href}?taskId=${id}`} title="Copy task link">
        <h1 className={`${TitleStyles} hover:underline`}>{`Task #${id}`}</h1>
      </WithTooltip>
    );
  }, [task]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between shadow-md">
      {RenderTitle}
      {RenderHeaderExtra}
      <ConfirmBox
        open={openConfirmDelete}
        title="Delete Task"
        description="Are you sure to delete this task ?"
        onClose={toggleConfirmDelete(false)}
        onConfirm={handleDelete}
      />
      <BaseModal
        className="w-[24rem]"
        title="Move to sprint"
        closable
        open={openMoveToSprint}
        onClose={toggleMoveToSprint(false)}>
        <Select
          placeholder="Select sprint"
          defaultActiveFirstOption
          onSelect={(sprintId: string) => setSprintIdToUpdate(sprintId)}
          className="w-full"
          value={task?.sprintId || ""}
          options={projectSprints.map((sprint: ObjectType) => ({ label: sprint.name, value: sprint.id }))}
        />
        <div className="flex gap-3 justify-end mt-5">
          <BaseButton onClick={toggleMoveToSprint(false)} variants="text" label="Cancel" />
          <BaseButton onClick={handleMoveToSprint} label="Move"></BaseButton>
        </div>
      </BaseModal>
    </div>
  );
}
