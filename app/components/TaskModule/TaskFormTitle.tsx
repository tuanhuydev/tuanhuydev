"use client";

import DynamicFormV2, { DynamicFormV2Config } from "../commons/FormV2/DynamicFormV2";
import { useGlobal } from "../commons/providers/GlobalProvider";
import { useSprintQuery } from "@app/_queries/sprintQueries";
import { useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from "@app/_queries/taskQueries";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LowPriorityOutlined from "@mui/icons-material/LowPriorityOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import PlaylistAddOutlined from "@mui/icons-material/PlaylistAddOutlined";
import PlaylistRemoveOutlinedIcon from "@mui/icons-material/PlaylistRemoveOutlined";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import LogService from "server/services/LogService";

// Replace dynamic imports with React lazy
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
      } finally {
        queryClient.invalidateQueries({ queryKey: ["tasks", task?.projectId] });
        queryClient.invalidateQueries({ queryKey: ["tasks", task.id, "subTasks"] });
      }
    },
    [createTaskMutation, notify, queryClient, task?.id, task?.projectId],
  );

  const handleConvertToTask = useCallback(async () => {
    try {
      await updateTaskMutation({ ...task, parentId: null });
      notify("Task moved to sprint successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["tasks", task?.id, "subTasks"] });
    } catch (error) {
      LogService.log(error);
      notify("Failed to move task to sprint", "error");
    }
  }, [notify, queryClient, task, updateTaskMutation]);

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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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
      if (task?.parentId) {
        items.unshift({
          label: "Convert to task",
          icon: <PlaylistRemoveOutlinedIcon fontSize="small" />,
          onClick: toggleModal("convertToTask", true),
        });
      } else {
        items.unshift({
          label: "Create sub-task",
          icon: <PlaylistAddOutlined fontSize="small" />,
          onClick: toggleModal("createSubTask", true),
        });
      }
    }
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    const handleItemClick = (onClick: () => void) => {
      onClick();
      handleMenuClose();
    };

    return (
      <div>
        <IconButton
          onClick={handleMenuClick}
          size="small"
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600">
          <MoreVert className="!text-lg text-slate-50" fontSize="small"/>
        </IconButton>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
          {items.map((item, index) => (
            <MenuItem
              key={`${item.label}-${index}`}
              onClick={() => handleItemClick(item.onClick)}
              className="flex items-center px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600">
              {item.icon && <span className="mr-2 flex items-center text-primary dark:text-slate-50">{item.icon}</span>}
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }, [allowSubTask, config, task?.parentId, toggleModal]);

  const renderHeaderExtra = useMemo(() => {
    const existingTask = !!task;
    return (
      <div className="px-2 flex gap-2 items-center relative">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <IconButton onClick={toggleMode(TASK_FORM_MODE.EDIT)}>
                <EditOutlined className="!text-lg text-slate-50" fontSize="small" />
              </IconButton>
            )}
            {isEditMode && (
              <IconButton onClick={toggleMode(TASK_FORM_MODE.VIEW)}>
                <EditOffOutlined className="!text-lg text-slate-50" fontSize="small" />
              </IconButton>
            )}
          </Fragment>
        )}
        {existingTask && <Fragment>{renderMenu}</Fragment>}
        <IconButton onClick={handleClose}>
          <CloseOutlined className="!text-lg text-white" />
        </IconButton>
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

        <Dialog open={modalsVisible.moveToSprint} onClose={toggleModal("moveToSprint", false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Move to sprint
            <IconButton onClick={toggleModal("moveToSprint", false)} sx={{ position: "absolute", right: 8, top: 8 }}>
              <CloseOutlined />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Select sprint</InputLabel>
              <Select
                value={sprintIdToUpdate}
                label="Select sprint"
                onChange={(event) => setSprintIdToUpdate(event.target.value as string)}>
                {projectSprints.map((sprint: Sprint) => (
                  <MenuItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleModal("moveToSprint", false)} variant="text">
              Cancel
            </Button>
            <Button onClick={handleMoveToSprintWithId} variant="contained">
              Move
            </Button>
          </DialogActions>
        </Dialog>
        {config && (
          <Dialog
            open={modalsVisible.createSubTask}
            onClose={toggleModal("createSubTask", false)}
            maxWidth="md"
            fullWidth>
            <DialogTitle>
              Create sub-task
              <IconButton onClick={toggleModal("createSubTask", false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                <CloseOutlined />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ minHeight: "400px", overflow: "auto" }}>
              <DynamicFormV2 config={config} onSubmit={handleCreateSubTaskWithModal} />
            </DialogContent>
          </Dialog>
        )}
      </Suspense>
    </div>
  );
}
