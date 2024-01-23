"use client";

import DynamicForm, { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Task } from "@prisma/client";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@store/slices/apiSlice";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export interface TaskFormProps {
  task?: Task;
  onDone?: (response: ObjectType) => void;
  onError?: (error: Error) => void;
  projectId: number;
  readonly?: boolean;
}

export default function TaskForm({ task, projectId, readonly = true, onDone, onError }: TaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const submit = async ({ id: taskId, ...restForm }: ObjectType, form: UseFormReturn) => {
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

  const config: DynamicFormConfig = {
    fields: [
      {
        name: "title",
        type: "text",
        options: {
          placeholder: "Task Title",
        },
        validate: { required: true },
      },
      {
        name: "statusId",
        type: "select",
        options: {
          placeholder: "Select Status",
          remote: {
            url: `${BASE_URL}/api/status?type=task`,
            label: "name",
            value: "id",
          },
        },
        validate: { required: true },
      },
      {
        name: "description",
        type: "richeditor",
        className: "min-h-[25rem]",
        options: { placeholder: "Task Description" },
        validate: { required: true },
      },
    ],
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
