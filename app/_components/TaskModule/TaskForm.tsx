"use client";

import { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Task } from "@prisma/client";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@store/slices/apiSlice";
import dynamic from "next/dynamic";
import React from "react";

const DynamicForm = dynamic(async () => (await import("@components/commons/Form/DynamicForm")).default, { ssr: false });
export interface TaskFormProps {
  task?: Task;
  config: DynamicFormConfig;
  onDone?: (response: ObjectType) => void;
  onError?: (error: Error) => void;
  projectId?: number;
}

export default function TaskForm({ task, projectId, onDone, onError, config }: TaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const submit = async ({ id: taskId, assignee, createdBy, ...restForm }: ObjectType) => {
    try {
      const response = taskId
        ? await updateTask({ ...restForm, taskId })
        : await createTask({
            ...restForm,
            projectId,
          });
      if ((response as ObjectType)?.error) throw new BaseError("Unable to save task");
      if (onDone) onDone(response);
    } catch (error) {
      if (onError) onError(error as Error);
    }
  };
  return (
    <DynamicForm
      disabled={isCreating}
      config={config}
      mapValues={task}
      submitProps={{
        className: "ml-auto",
      }}
      onSubmit={submit}
    />
  );
}
