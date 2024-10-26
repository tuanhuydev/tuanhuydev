"use client";

import { DynamicFormConfig } from "@app/components/commons/Form/DynamicForm";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@app/queries/taskQueries";
import LogService from "@lib/services/LogService";
import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

const DynamicForm = dynamic(async () => (await import("@app/components/commons/Form/DynamicForm")).default, {
  ssr: false,
});

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
    async (formData: ObjectType, form?: UseFormReturn) => {
      try {
        const newTaskBody = { ...formData, projectId };
        await mutateCrateTask(newTaskBody);
      } catch (error) {
        LogService.log(error);
      } finally {
        form?.reset();
      }
    },
    [mutateCrateTask, projectId],
  );

  const updateTaskMutation = useCallback(
    async (formData: ObjectType, form?: UseFormReturn) => {
      try {
        await mutateUpdateTask(formData);
      } catch (error) {
        LogService.log(error);
      } finally {
        form?.reset();
      }
    },
    [mutateUpdateTask],
  );

  const handleTaskMutation = async (
    formData: ObjectType,
    mutationFn: (data: ObjectType) => Promise<any>,
    form?: UseFormReturn,
  ) => {
    try {
      await mutationFn(formData);
    } catch (error) {
      LogService.log(error);
    } finally {
      if (form) form?.reset();
    }
  };

  const onSubmit = useCallback(
    async (formData: ObjectType, form?: UseFormReturn) => {
      const mutationFn = task ? updateTaskMutation : createTaskMutation;
      await handleTaskMutation(formData, mutationFn, form);
    },
    [createTaskMutation, task, updateTaskMutation],
  );

  useEffect(() => {
    if (isSuccess && onDone) onDone();
  }, [isSuccess, onDone]);

  return <DynamicForm disabled={creating} config={config} mapValues={task} onSubmit={onSubmit} />;
}
