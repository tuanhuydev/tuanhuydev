"use client";

import { Task } from "@lib/types/task";
import { DynamicFormConfig } from "@resources/components/form/DynamicForm";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@resources/queries/taskQueries";
import { logService } from "@server/services/LogService";
import { Suspense, lazy, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

const DynamicForm = lazy(() => import("@resources/components/form/DynamicForm"));

export interface TaskFormProps {
  task?: Task;
  config: DynamicFormConfig;
  onDone?: () => void;
  onError?: (error: Error) => void;
  projectId?: number;
}

export default function TaskForm({ task, projectId, onDone, config }: TaskFormProps) {
  // Hooks
  const { mutateAsync: mutateCrateTask, isPending: isCreating, isSuccess: isCreateSuccess } = useCreateTaskMutation();
  const { mutateAsync: mutateUpdateTask, isPending: isUpdating, isSuccess: isUpdateSuccess } = useUpdateTaskMutation();

  // Constants
  const creating = isCreating || isUpdating;
  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const createTaskMutation = useCallback(
    async (formData: Record<string, unknown>, form?: UseFormReturn) => {
      try {
        const newTaskBody = { ...formData, projectId };
        await mutateCrateTask(newTaskBody);
      } catch (error) {
        logService.log(error);
      } finally {
        form?.reset();
      }
    },
    [mutateCrateTask, projectId],
  );

  const updateTaskMutation = useCallback(
    async (formData: Record<string, unknown>, form?: UseFormReturn) => {
      try {
        await mutateUpdateTask(formData as Partial<Task>);
      } catch (error) {
        logService.log(error);
      } finally {
        form?.reset();
      }
    },
    [mutateUpdateTask],
  );

  const handleTaskMutation = async (
    formData: Record<string, unknown>,
    mutationFn: (data: Record<string, unknown>) => Promise<unknown>,
    form?: UseFormReturn,
  ) => {
    try {
      await mutationFn(formData);
    } catch (error) {
      logService.log(error);
    } finally {
      if (form) form?.reset();
    }
  };

  const onSubmit = useCallback(
    async (formData: Record<string, unknown>, form?: UseFormReturn) => {
      const mutationFn = task ? updateTaskMutation : createTaskMutation;
      await handleTaskMutation(formData, mutationFn, form);
    },
    [createTaskMutation, task, updateTaskMutation],
  );

  useEffect(() => {
    if (isSuccess && onDone) onDone();
  }, [isSuccess, onDone]);

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <DynamicForm disabled={creating} config={config} mapValues={task} onSubmit={onSubmit} />
    </Suspense>
  );
}
