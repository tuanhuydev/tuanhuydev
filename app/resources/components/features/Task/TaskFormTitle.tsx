"use client";

import { useGlobal } from "../../common/providers/GlobalProvider";
import { BASE_URL } from "@lib/commons/constants/base";
import { Task } from "@lib/types/task";
import { useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from "@resources/queries/taskQueries";
import { logService } from "@server/services/LogService";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Edit2, ListPlus, ListX, Trash2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, lazy, useCallback, useEffect, useMemo, useReducer } from "react";

// Replace dynamic imports with React lazy
const BaseMenu = lazy(() => import("@resources/components/content/BaseMenu"));
const BaseModal = lazy(() => import("@resources/components/common/modals/BaseModal"));
const WithCopy = lazy(() => import("@resources/components/common/hocs/WithCopy"));
const ConfirmBox = lazy(() => import("@resources/components/common/modals/ConfirmBox"));

// Types and Interfaces
export type ToastSeverity = "success" | "error" | "info" | "warning";

export type TaskFormMode = "VIEW" | "EDIT";

export interface TaskFormModalsVisibility {
  createSubTask: boolean;
  openConfirmDelete: boolean;
  convertToTask: boolean;
}

export interface TaskFormTitleProps {
  task: Partial<Task> | null;
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
    CREATE_SUB_TASK: "w-[50rem]",
    SUB_TASK_FORM_HEIGHT: "h-96",
  },
  TITLE_STYLES: "my-0 mr-3 px-3 py-2 text-foreground text-base font-semibold truncate",
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
  notify: (message: string, type: ToastSeverity) => void,
  onClose: () => void,
) => {
  const queryClient = useQueryClient();
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
      logService.log(error);
      notify("Failed to delete task", "error");
    }
  }, [deleteTaskMutation, notify, onClose, task?.id]);

  const handleCreateSubTask = useCallback(
    async (formData: Record<string, unknown>) => {
      if (!task?.id) {
        notify("Task ID is required", "error");
        return;
      }

      try {
        await createTaskMutation({
          ...formData,
          parentId: task.id,
        } as Record<string, unknown>);
        notify("Sub-task created successfully", "success");
      } catch (error) {
        logService.log(error);
        notify("Failed to create sub-task", "error");
      } finally {
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        await queryClient.invalidateQueries({ queryKey: ["tasks", task.id, "subTasks"] });
      }
    },
    [createTaskMutation, notify, queryClient, task?.id],
  );

  const handleConvertToTask = useCallback(async () => {
    try {
      // await updateTaskMutation({ ...task, parentId: null });
      notify("Task moved to sprint successfully", "success");
      await queryClient.invalidateQueries({ queryKey: ["tasks", task?.id, "subTasks"] });
    } catch (error) {
      logService.log(error);
      notify("Failed to move task to sprint", "error");
    }
  }, [notify, queryClient, task, updateTaskMutation]);

  return {
    handleDelete,
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
}: TaskFormTitleProps) {
  // Hooks
  const { notify } = useGlobal();
  const pathname = usePathname();
  const { modalsVisible, toggleModal } = useModalManager();

  // Task Actions
  const handleCloseCallback = useCallback(() => onClose(false), [onClose]);
  const { handleDelete, handleCreateSubTask, handleConvertToTask, isCreateSuccess } = useTaskActions(
    task,
    notify,
    handleCloseCallback,
  );

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

  const handleDeleteWithModal = useCallback(async () => {
    await handleDelete();
    toggleModal("openConfirmDelete", false)();
  }, [handleDelete, toggleModal]);

  const renderMenu = useMemo(() => {
    const items = [
      {
        label: "Delete task",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: toggleModal("openConfirmDelete", true),
      },
    ];
    if (allowSubTask) {
      if (task?.parentId) {
        items.unshift({
          label: "Convert to task",
          icon: <ListX className="h-4 w-4" />,
          onClick: toggleModal("convertToTask", true),
        });
      } else {
        items.unshift({
          label: "Create sub-task",
          icon: <ListPlus className="h-4 w-4" />,
          onClick: toggleModal("createSubTask", true),
        });
      }
    }
    return <BaseMenu items={items} />;
  }, [allowSubTask, task?.parentId, toggleModal]);

  const renderHeaderExtra = useMemo(() => {
    const existingTask = !!task;
    const buttonClasses =
      "cursor-pointer outline-none rounded-md flex justify-center items-center gap-1 transition-all duration-300 p-1 bg-primary border-none text-slate-50 dark:bg-slate-500 dark:text-slate-200 disabled:bg-slate-200 disabled:text-slate-400 w-8 h-8";

    return (
      <div className="px-2 flex gap-2 items-center relative">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <button className={buttonClasses} onClick={toggleMode(TASK_FORM_MODE.EDIT)} title="Edit task">
                <Edit className="h-4 w-4" />
              </button>
            )}
            {isEditMode && (
              <button className={buttonClasses} onClick={toggleMode(TASK_FORM_MODE.VIEW)} title="View mode">
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </Fragment>
        )}
        {existingTask && <Fragment>{renderMenu}</Fragment>}
        <button className={buttonClasses} onClick={handleClose} title="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }, [renderMenu, allowEditTask, handleClose, isEditMode, isViewMode, task, toggleMode]);

  const renderTitle = useMemo(() => {
    if (!task) return <h1 className={UI_CONSTANTS.TITLE_STYLES}>Create new task</h1>;
    const { id } = task;
    const taskUrl = `${BASE_URL}/dashboard/home?taskId=${id}`;

    return (
      <WithCopy content={taskUrl} title="Copy task link">
        <h1
          className={`${UI_CONSTANTS.TITLE_STYLES} hover:underline cursor-pointer max-w-[275px] sm:max-w-xs md:max-w-md`}>
          {`Task #${id}`}
        </h1>
      </WithCopy>
    );
  }, [task, pathname]);

  useEffect(() => {
    if (isCreateSuccess) {
      toggleModal("createSubTask", false)();
    }
  }, [isCreateSuccess, toggleModal]);

  return (
    <div className="bg-background flex justify-between items-center px-3 py-2 shrink-0 sm:rounded-t-lg">
      {renderTitle}
      {renderHeaderExtra}
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmBox
          open={modalsVisible.openConfirmDelete}
          title="Delete Task"
          description="Are you sure to delete this task?"
          onClose={toggleModal("openConfirmDelete", false)}
          onConfirm={void handleDeleteWithModal}
        />
        <ConfirmBox
          open={modalsVisible.convertToTask}
          title="Convert to Task"
          description="Are you sure to convert to task?"
          onClose={toggleModal("convertToTask", false)}
          onConfirm={void handleConvertToTask}
        />

        <BaseModal
          className={UI_CONSTANTS.MODAL_WIDTHS.CREATE_SUB_TASK}
          title="Create sub-task"
          closable
          open={modalsVisible.createSubTask}
          onClose={toggleModal("createSubTask", false)}>
          <div className="p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sub-task creation form will be implemented later
            </p>
          </div>
        </BaseModal>
      </Suspense>
    </div>
  );
}
