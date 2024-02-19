"use client";

import { useCreateProjectMutation, useUpdateProjectMutation } from "@app/_configs/store/slices/apiSlice";
import DynamicForm, { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Project } from "@prisma/client";
import { App } from "antd";

export interface ProjectFormProps {
  project?: Project;
  callback?: () => void;
}

export default function ProjectForm({ project, callback }: ProjectFormProps) {
  const isEditMode = !!project;

  const { notification } = App.useApp();

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const config: DynamicFormConfig = {
    fields: [
      {
        name: "name",
        type: "text",
        options: {
          placeholder: "Project Name",
        },
        validate: { required: true },
      },
      {
        name: "startDate",
        type: "datepicker",
        options: {
          placeholder: "Start Date",
        },
        validate: { required: true },
        className: "w-1/2",
      },
      {
        name: "endDate",
        type: "datepicker",
        options: {
          placeholder: "End Date",
        },
        validate: { required: true, min: "startDate" },
        className: "w-1/2",
      },
      {
        name: "clientName",
        type: "text",
        options: {
          placeholder: "Client Name",
        },
        validate: { required: true },
      },
      {
        name: "users",
        type: "select",
        options: {
          placeholder: "Add users",
          mode: "multiple",
          allowClear: true,
          remote: {
            url: "/api/users",
            label: "name",
            value: "id",
          },
        },
        validate: { required: true, multiple: true },
      },
      {
        name: "description",
        type: "richeditor",
        options: { placeholder: "Project Description" },
        validate: { required: true },
      },
    ],
  };

  const onSubmit = async (formData: ObjectType) => {
    try {
      const { data }: any = isEditMode ? await updateProject(formData) : await createProject(formData);
      if (!data?.success) throw new Error("Unable to save");

      notification.success({ message: "Save successfully" });
      if (callback) callback();
    } catch (error) {
      notification.error({ message: (error as BaseError).message });
    }
  };

  return (
    <DynamicForm config={config} onSubmit={onSubmit} submitProps={{ className: "ml-auto mr-2" }} mapValues={project} />
  );
}
