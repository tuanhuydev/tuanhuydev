"use client";

import DynamicForm, { DynamicFormConfig } from "@lib/components/commons/Form/DynamicForm";
import { ObjectType } from "@lib/shared/interfaces/base";
import { useCreateTaskMutation } from "@lib/store/slices/apiSlice";
import { Task } from "@prisma/client";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export interface TaskFormProps {
  task?: Task;
  onDone?: (response: ObjectType) => void;
  projectId: number;
}

export default function TaskForm({ task, projectId, onDone }: TaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  const submit = async (formData: ObjectType, form: UseFormReturn) => {
    try {
      const newTask = {
        ...formData,
        projectId,
      };
      const response = await createTask(newTask);
      if (response && onDone) onDone(response);

      return;
    } catch (error) {
      console.log(error);
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
