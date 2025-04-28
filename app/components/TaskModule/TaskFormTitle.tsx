"use client";

import DynamicForm, { DynamicFormConfig } from "../commons/Form/DynamicForm";
import BaseSelect from "../commons/Inputs/BaseSelect";
import { useGlobal } from "../commons/providers/GlobalProvider";
import { useSprintQuery } from "@app/_queries/sprintQueries";
import { useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from "@app/_queries/taskQueries";
import BaseButton from "@app/components/commons/buttons/BaseButton";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LowPriorityOutlined from "@mui/icons-material/LowPriorityOutlined";
import PlaylistAddOutlined from "@mui/icons-material/PlaylistAddOutlined";
import { Fragment, Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import LogService from "server/services/LogService";

// Replace dynamic imports with React lazy
const BaseMenu = lazy(() => import("@app/components/commons/BaseMenu"));
const BaseModal = lazy(() => import("@app/components/commons/modals/BaseModal"));
const WithCopy = lazy(() => import("@app/components/commons/hocs/WithCopy"));
const ConfirmBox = lazy(() => import("@app/components/commons/modals/ConfirmBox"));

export interface TaskFormModalsVisibility {
  createSubTask: boolean;
  moveToSprint: boolean;
  openConfirmDelete: boolean;
}

export interface TaskFormTitleProps {
  task: ObjectType | null;
  config?: DynamicFormConfig;
  mode: "VIEW" | "EDIT";
  allowEditTask?: boolean;
  allowDeleteTask?: boolean;
  allowSubTask?: boolean;
  onClose: (open: boolean) => void;
  onToggle: (mode: string) => void;
}

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

export default function TaskFormTitle({
  task,
  mode,
  allowEditTask = false,
  allowSubTask = false,
  onClose,
  onToggle,
  config,
}: TaskFormTitleProps) {
  // Hooks
  const { notify } = useGlobal();
  const { mutateAsync: deleteTaskMutation } = useDeleteTaskMutation();
  const { mutateAsync: moveSprintMutation } = useUpdateTaskMutation();
  const { mutateAsync: mutateCrateTask, isSuccess: isCreateSuccess } = useCreateTaskMutation();

  const { data: projectSprints = [] } = useSprintQuery(task?.projectId || "", { status: "ACTIVE" });

  // States
  const [sprintIdToUpdate, setSprintIdToUpdate] = useState<string>("");

  const [modalsVisible, setModalsVisible] = useState<TaskFormModalsVisibility>({
    createSubTask: false,
    moveToSprint: false,
    openConfirmDelete: false,
  });

  const toggleModalVibible = useCallback(
    (key: keyof TaskFormModalsVisibility, value: boolean) => () => {
      setModalsVisible((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetModalVisibility = useCallback(() => {
    setModalsVisible({
      createSubTask: false,
      moveToSprint: false,
      openConfirmDelete: false,
    });
  }, []);

  // Constants
  const isViewMode = mode === "VIEW";
  const isEditMode = mode === "EDIT";

  const toggleMode = useCallback(
    (mode: string) => () => {
      onToggle(mode as "VIEW" | "EDIT");
    },
    [onToggle],
  );

  const handleClose = useCallback(() => onClose(false), [onClose]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteTaskMutation((task as ObjectType).id.toString());
      notify("Task deleted successfully", "success");
    } catch (error) {
      LogService.log(error);
    } finally {
      onClose(false);
      toggleModalVibible("openConfirmDelete", false)();
    }
  }, [deleteTaskMutation, notify, onClose, task, toggleModalVibible]);

  const handleMoveToSprint = useCallback(async () => {
    if (!sprintIdToUpdate) return;
    try {
      await moveSprintMutation({ ...task, sprintId: sprintIdToUpdate });
      resetModalVisibility();

      notify("Task moved to sprint successfully", "success");
    } catch (error) {
      notify("Failed to move task to sprint", "error");
    }
  }, [moveSprintMutation, notify, resetModalVisibility, sprintIdToUpdate, task]);

  const handleCreateSubTask = useCallback(
    (formData: any) => {
      mutateCrateTask({ ...formData, parentId: task?.id, projectId: task?.projectId });
      notify("Sub-task created successfully", "success");
    },
    [mutateCrateTask, notify, task?.id, task?.projectId],
  );

  const RenderMenu = useMemo(() => {
    const items = [
      {
        label: "Move to sprint",
        icon: <LowPriorityOutlined fontSize="small" />,
        onClick: toggleModalVibible("moveToSprint", true),
      },
      {
        label: "Delete task",
        icon: <DeleteOutlined fontSize="small" />,
        onClick: toggleModalVibible("openConfirmDelete", true),
      },
    ];
    if (allowSubTask && config) {
      items.unshift({
        label: "Create sub-task",
        icon: <PlaylistAddOutlined fontSize="small" />,
        onClick: toggleModalVibible("createSubTask", true),
      });
    }
    return <BaseMenu items={items} />;
  }, [allowSubTask, config, toggleModalVibible]);

  const RenderHeaderExtra = useMemo(() => {
    const existingTask = !!task;
    return (
      <div className="px-2 flex gap-2 items-center relative">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <BaseButton
                onClick={toggleMode(COMPONENT_MODE.EDIT)}
                icon={<EditOutlined className="!text-lg text-slate-50" fontSize="small" />}
              />
            )}
            {isEditMode && (
              <BaseButton
                onClick={toggleMode(COMPONENT_MODE.VIEW)}
                icon={<EditOffOutlined className="!text-lg text-slate-50" fontSize="small" />}
              />
            )}
          </Fragment>
        )}
        {existingTask && <Fragment>{RenderMenu}</Fragment>}
        <BaseButton onClick={handleClose} icon={<CloseOutlined className="!text-lg text-white" />} />
      </div>
    );
  }, [RenderMenu, allowEditTask, handleClose, isEditMode, isViewMode, task, toggleMode]);

  const RenderTitle = useMemo(() => {
    const TitleStyles = "my-0 mr-3 px-3 py-2 bg-primary text-white text-base";
    if (!task) return <h1 className={TitleStyles}>Create new task</h1>;
    const { id } = task;

    return (
      <WithCopy
        content={typeof window !== undefined ? `${window.location.href}?taskId=${id}` : ""}
        title="Copy task link">
        <h1 className={`${TitleStyles} hover:underline`}>{`Task #${id}`}</h1>
      </WithCopy>
    );
  }, [task]);

  useEffect(() => {
    if (isCreateSuccess) {
      toggleModalVibible("createSubTask", false)();
    }
  }, [isCreateSuccess, toggleModalVibible]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between shadow-md">
      {RenderTitle}
      {RenderHeaderExtra}
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmBox
          open={modalsVisible.openConfirmDelete}
          title="Delete Task"
          description="Are you sure to delete this task ?"
          onClose={toggleModalVibible("openConfirmDelete", false)}
          onConfirm={handleDelete}
        />
        <BaseModal
          className="w-[24rem]"
          title="Move to sprint"
          closable
          open={modalsVisible.moveToSprint}
          onClose={toggleModalVibible("moveToSprint", false)}>
          <BaseSelect
            value={sprintIdToUpdate}
            options={{
              className: "w-full",
              placeholder: "Select sprint",
              options: projectSprints.map((sprint: ObjectType) => ({ label: sprint.name, value: sprint.id })),
            }}
            onChange={(sprintId: string) => setSprintIdToUpdate(sprintId)}
            keyProp={"sprint"}
          />

          <div className="flex gap-3 justify-end mt-5">
            <BaseButton onClick={toggleModalVibible("moveToSprint", false)} variants="text" label="Cancel" />
            <BaseButton onClick={handleMoveToSprint} label="Move"></BaseButton>
          </div>
        </BaseModal>
        {config && (
          <BaseModal
            className="w-[50rem]"
            title="Create sub-task"
            closable
            open={modalsVisible.createSubTask}
            onClose={toggleModalVibible("createSubTask", false)}>
            <div className="h-[24rem] overflow-auto">
              <DynamicForm config={config} onSubmit={handleCreateSubTask} />
            </div>
          </BaseModal>
        )}
      </Suspense>
    </div>
  );
}
