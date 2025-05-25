"use client";

import DynamicFormV2, { DynamicFormV2Config } from "../commons/FormV2/DynamicFormV2";
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
import PlaylistRemoveOutlinedIcon from "@mui/icons-material/PlaylistRemoveOutlined";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import LogService from "server/services/LogService";

// Replace dynamic imports with React lazy
const BaseMenu = lazy(() => import("@app/components/commons/BaseMenu"));
const BaseModal = lazy(() => import("@app/components/commons/modals/BaseModal"));
const WithCopy = lazy(() => import("@app/components/commons/hocs/WithCopy"));
const ConfirmBox = lazy(() => import("@app/components/commons/modals/ConfirmBox"));

// Types and Interfaces
interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  sprintId?: string;
  parentId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface Sprint {
  id: string;
  name: string;
  status: string;
}

export type TaskFormMode = "VIEW" | "EDIT";

export interface TaskFormModalsVisibility {
  createSubTask: boolean;
  moveToSprint: boolean;
  openConfirmDelete: boolean;
  convertToTask: boolean;
}

export interface TaskFormTitleProps {
  task: Partial<Task> | null;
  config?: DynamicFormV2Config;
  mode: TaskFormMode;
  allowEditTask?: boolean;
  allowDeleteTask?: boolean;
  allowSubTask?: boolean;
  onClose: (open: boolean) => void;
  onToggle: (mode: TaskFormMode) => void;
}

// Constants
const TASK_FORM_MODE = {
  VIEW: "VIEW" as const,
  EDIT: "EDIT" as const,
};

const UI_CONSTANTS = {
  MODAL_WIDTHS: {
    MOVE_TO_SPRINT: "w-96",
    CREATE_SUB_TASK: "w-[50rem]",
    SUB_TASK_FORM_HEIGHT: "h-96",
  },
  TITLE_STYLES: "my-0 mr-3 px-3 py-2 bg-primary text-white text-base truncate",
} as const;

// Modal State Management
type ModalAction =
  | { type: "TOGGLE_MODAL"; key: keyof TaskFormModalsVisibility; value: boolean }
  | { type: "RESET_MODALS" };

const modalReducer = (state: TaskFormModalsVisibility, action: ModalAction): TaskFormModalsVisibility => {
  switch (action.type) {
    case "TOGGLE_MODAL":
      return { ...state, [action.key]: action.value };
    case "RESET_MODALS":
      return {
        createSubTask: false,
        moveToSprint: false,
        openConfirmDelete: false,
        convertToTask: false,
      };
    default:
      return state;
  }
};

const useModalManager = () => {
  const [modalsVisible, dispatch] = useReducer(modalReducer, {
    createSubTask: false,
    moveToSprint: false,
    openConfirmDelete: false,
    convertToTask: false,
  });

  const toggleModal = useCallback(
    (key: keyof TaskFormModalsVisibility, value: boolean) => () => {
      dispatch({ type: "TOGGLE_MODAL", key, value });
    },
    [],
  );

  const resetModals = useCallback(() => {
    dispatch({ type: "RESET_MODALS" });
  }, []);

  return { modalsVisible, toggleModal, resetModals };
};

// Custom Hook for Task Actions
const useTaskActions = (
  task: Partial<Task> | null,
  notify: (message: string, type: string) => void,
  onClose: () => void,
) => {
  console.log("useTaskActions called with task:", task);
  const { mutateAsync: deleteTaskMutation } = useDeleteTaskMutation();
  const { mutateAsync: updateTaskMutation } = useUpdateTaskMutation();
  const { mutateAsync: createTaskMutation, isSuccess: isCreateSuccess } = useCreateTaskMutation();

  const handleDelete = useCallback(async () => {
    if (!task?.id) {
      notify("Task ID is required for deletion", "error");
      return;
    }

    try {
      await deleteTaskMutation(task.id.toString());
      notify("Task deleted successfully", "success");
      onClose();
    } catch (error) {
      LogService.log(error);
      notify("Failed to delete task", "error");
    }
  }, [deleteTaskMutation, notify, onClose, task?.id]);

  const handleMoveToSprint = useCallback(
    async (sprintId: string) => {
      if (!sprintId || !task) {
        notify("Sprint ID and task are required", "error");
        return;
      }

      try {
        await updateTaskMutation({ ...task, sprintId });
        notify("Task moved to sprint successfully", "success");
      } catch (error) {
        LogService.log(error);
        notify("Failed to move task to sprint", "error");
      }
    },
    [updateTaskMutation, notify, task],
  );

  const handleCreateSubTask = useCallback(
    async (formData: any) => {
      if (!task?.id || !task?.projectId) {
        notify("Task ID and Project ID are required", "error");
        return;
      }

      try {
        await createTaskMutation({
          ...formData,
          parentId: task.id,
          projectId: task.projectId,
        });
        notify("Sub-task created successfully", "success");
      } catch (error) {
        LogService.log(error);
        notify("Failed to create sub-task", "error");
      }
    },
    [createTaskMutation, notify, task?.id, task?.projectId],
  );

  const handleConvertToTask = useCallback(async () => {
    try {
      await updateTaskMutation({ ...task, parentId: null });
      notify("Task moved to sprint successfully", "success");
    } catch (error) {
      LogService.log(error);
      notify("Failed to move task to sprint", "error");
    }
  }, [notify, task, updateTaskMutation]);

  return {
    handleDelete,
    handleMoveToSprint,
    handleCreateSubTask,
    handleConvertToTask,
    isCreateSuccess,
  };
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
  const pathname = usePathname();
  const { modalsVisible, toggleModal, resetModals } = useModalManager();
  const { data: projectSprints = [] } = useSprintQuery(task?.projectId || "", { status: "ACTIVE" });

  // States
  const [sprintIdToUpdate, setSprintIdToUpdate] = useState<string>("");

  // Task Actions
  const handleCloseCallback = useCallback(() => onClose(false), [onClose]);
  const { handleDelete, handleMoveToSprint, handleCreateSubTask, handleConvertToTask, isCreateSuccess } =
    useTaskActions(task, notify, handleCloseCallback);

  // Constants
  const isViewMode = mode === TASK_FORM_MODE.VIEW;
  const isEditMode = mode === TASK_FORM_MODE.EDIT;

  const toggleMode = useCallback(
    (newMode: TaskFormMode) => () => {
      onToggle(newMode);
    },
    [onToggle],
  );

  const handleClose = useCallback(() => onClose(false), [onClose]);

  const handleMoveToSprintWithId = useCallback(async () => {
    if (!sprintIdToUpdate) {
      notify("Please select a sprint", "error");
      return;
    }

    await handleMoveToSprint(sprintIdToUpdate);
    resetModals();
    setSprintIdToUpdate("");
  }, [handleMoveToSprint, sprintIdToUpdate, resetModals, notify]);

  const handleDeleteWithModal = useCallback(async () => {
    await handleDelete();
    toggleModal("openConfirmDelete", false)();
  }, [handleDelete, toggleModal]);

  const handleCreateSubTaskWithModal = useCallback(
    async (formData: any) => {
      await handleCreateSubTask(formData);
      toggleModal("createSubTask", false)();
    },
    [handleCreateSubTask, toggleModal],
  );

  const renderMenu = useMemo(() => {
    const items = [
      {
        label: "Move to sprint",
        icon: <LowPriorityOutlined fontSize="small" />,
        onClick: toggleModal("moveToSprint", true),
      },
      {
        label: "Delete task",
        icon: <DeleteOutlined fontSize="small" />,
        onClick: toggleModal("openConfirmDelete", true),
      },
    ];
    if (allowSubTask && config) {
      items.unshift(
        {
          label: "Create sub-task",
          icon: <PlaylistAddOutlined fontSize="small" />,
          onClick: toggleModal("createSubTask", true),
        },
        {
          label: "Convert to task",
          icon: <PlaylistRemoveOutlinedIcon fontSize="small" />,
          onClick: toggleModal("convertToTask", true),
        },
      );
    }
    return <BaseMenu items={items} />;
  }, [allowSubTask, config, toggleModal]);

  const renderHeaderExtra = useMemo(() => {
    const existingTask = !!task;
    return (
      <div className="px-2 flex gap-2 items-center relative">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <BaseButton
                onClick={toggleMode(TASK_FORM_MODE.EDIT)}
                icon={<EditOutlined className="!text-lg text-slate-50" fontSize="small" />}
              />
            )}
            {isEditMode && (
              <BaseButton
                onClick={toggleMode(TASK_FORM_MODE.VIEW)}
                icon={<EditOffOutlined className="!text-lg text-slate-50" fontSize="small" />}
              />
            )}
          </Fragment>
        )}
        {existingTask && <Fragment>{renderMenu}</Fragment>}
        <BaseButton onClick={handleClose} icon={<CloseOutlined className="!text-lg text-white" />} />
      </div>
    );
  }, [renderMenu, allowEditTask, handleClose, isEditMode, isViewMode, task, toggleMode]);

  const renderTitle = useMemo(() => {
    if (!task) return <h1 className={UI_CONSTANTS.TITLE_STYLES}>Create new task</h1>;
    const { id } = task;
    const taskUrl = `${pathname}?taskId=${id}`;

    return (
      <WithCopy content={taskUrl} title="Copy task link">
        <h1 className={`${UI_CONSTANTS.TITLE_STYLES} hover:underline cursor-pointer`}>{`Task #${id}`}</h1>
      </WithCopy>
    );
  }, [task, pathname]);

  useEffect(() => {
    if (isCreateSuccess) {
      toggleModal("createSubTask", false)();
    }
  }, [isCreateSuccess, toggleModal]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between shadow-md">
      {renderTitle}
      {renderHeaderExtra}
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmBox
          open={modalsVisible.openConfirmDelete}
          title="Delete Task"
          description="Are you sure to delete this task?"
          onClose={toggleModal("openConfirmDelete", false)}
          onConfirm={handleDeleteWithModal}
        />
        <ConfirmBox
          open={modalsVisible.convertToTask}
          title="Convert to Task"
          description="Are you sure to convert to task?"
          onClose={toggleModal("convertToTask", false)}
          onConfirm={handleConvertToTask}
        />

        <BaseModal
          className={UI_CONSTANTS.MODAL_WIDTHS.MOVE_TO_SPRINT}
          title="Move to sprint"
          closable
          open={modalsVisible.moveToSprint}
          onClose={toggleModal("moveToSprint", false)}>
          <BaseSelect
            value={sprintIdToUpdate}
            options={{
              className: "w-full",
              placeholder: "Select sprint",
              options: projectSprints.map((sprint: Sprint) => ({
                label: sprint.name,
                value: sprint.id,
              })),
            }}
            onChange={(sprintId: string) => setSprintIdToUpdate(sprintId)}
            keyProp="sprint"
          />

          <div className="flex gap-3 justify-end mt-5">
            <BaseButton onClick={toggleModal("moveToSprint", false)} variants="text" label="Cancel" />
            <BaseButton onClick={handleMoveToSprintWithId} label="Move" />
          </div>
        </BaseModal>
        {config && (
          <BaseModal
            className={UI_CONSTANTS.MODAL_WIDTHS.CREATE_SUB_TASK}
            title="Create sub-task"
            closable
            open={modalsVisible.createSubTask}
            onClose={toggleModal("createSubTask", false)}>
            <div className={UI_CONSTANTS.MODAL_WIDTHS.SUB_TASK_FORM_HEIGHT + " overflow-auto"}>
              <DynamicFormV2 config={config} onSubmit={handleCreateSubTaskWithModal} />
            </div>
          </BaseModal>
        )}
      </Suspense>
    </div>
  );
}
