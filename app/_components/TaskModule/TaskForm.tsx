"use client";

import { useCreateTaskMutation, useUpdateTaskMutation } from "@app/queries/taskQueries";
import { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import LogService from "@lib/services/LogService";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

const DynamicForm = dynamic(async () => (await import("@components/commons/Form/DynamicForm")).default, { ssr: false });
export interface TaskFormProps {
  task?: Task;
  config: DynamicFormConfig;
  onDone?: () => void;
  onError?: (error: Error) => void;
  projectId?: number;
}

export default function TaskForm({ task, projectId, onDone, config }: TaskFormProps) {
  const { mutateAsync: mutateCrateTask, isPending: isCreating, isSuccess: isCreateSuccess } = useCreateTaskMutation();
  const { mutateAsync: mutateUpdateTask, isPending: isUpdating, isSuccess: isUpdateSuccess } = useUpdateTaskMutation();

  const isUpdatingTask: boolean = !!task;

  const createTask = async (formData: ObjectType, form?: UseFormReturn) => {
    try {
      const newTaskBody = { ...formData, projectId };
      await mutateCrateTask(newTaskBody);
    } catch (error) {
      LogService.log(error);
    } finally {
      form?.reset();
    }
  };

  const updateTask = async (formData: ObjectType, form?: UseFormReturn) => {
    try {
      await mutateUpdateTask(formData);
    } catch (error) {
      LogService.log(error);
    } finally {
      form?.reset();
    }
  };

  const submit = async (formData: ObjectType, form?: UseFormReturn) => {
    if (isUpdatingTask) return updateTask(formData);
    return createTask(formData, form);
  };

  useEffect(() => {
    if ((isCreateSuccess || isUpdateSuccess) && onDone) onDone();
  }, [isCreateSuccess, isUpdateSuccess, onDone]);
  return (
    <DynamicForm
      disabled={isCreating || isUpdating}
      config={config}
      mapValues={task}
      submitProps={{
        className: "ml-auto",
      }}
      onSubmit={submit}
    />
  );
}
