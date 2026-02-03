"use client";

import { Task } from "@lib/types/task";
import { Button } from "@resources/components/common/Button";
import { FormInput, InputType } from "@resources/components/formV2/FormInput";
import { FormTextarea } from "@resources/components/formV2/FormTextarea";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@resources/queries/taskQueries";
import { logService } from "@server/services/LogService";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export interface TaskFormProps {
  task?: Task;
  onDone?: () => void;
  onError?: (error: Error) => void;
  projectId?: number;
}

type TaskFormData = {
  title: string;
  description: string;
  type: string;
};

export default function TaskForm({ task, projectId, onDone }: TaskFormProps) {
  // Hooks
  const { mutateAsync: mutateCrateTask, isPending: isCreating, isSuccess: isCreateSuccess } = useCreateTaskMutation();
  const { mutateAsync: mutateUpdateTask, isPending: isUpdating, isSuccess: isUpdateSuccess } = useUpdateTaskMutation();

  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      type: task?.type || "STORY",
    },
  });

  // Constants
  const creating = isCreating || isUpdating;
  const isSuccess = isCreateSuccess || isUpdateSuccess;

  const onSubmit = useCallback(
    async (formData: TaskFormData) => {
      try {
        if (task) {
          await mutateUpdateTask({ ...task, ...formData } as Partial<Task>);
        } else {
          const newTaskBody = { ...formData, projectId };
          await mutateCrateTask(newTaskBody);
        }
        reset();
      } catch (error) {
        logService.log(error);
      }
    },
    [mutateCrateTask, mutateUpdateTask, projectId, reset, task],
  );

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        type: task.type || "STORY",
      });
    }
  }, [task, reset]);

  useEffect(() => {
    if (isSuccess && onDone) onDone();
  }, [isSuccess, onDone]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <FormInput label="Title" name="title" type={InputType.TEXT} control={control} placeholder="Task title" />

      <FormTextarea label="Description" name="description" control={control} placeholder="Task description" rows={4} />

      <FormInput
        label="Type"
        name="type"
        type={InputType.TEXT}
        control={control}
        placeholder="STORY, BUG, ISSUE, EPIC"
      />

      <Button type="submit" disabled={creating} className="w-full">
        {creating ? (task ? "Updating..." : "Creating...") : task ? "Update Task" : "Create Task"}
      </Button>
    </form>
  );
}
