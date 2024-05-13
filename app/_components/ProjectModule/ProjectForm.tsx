"use client";

import { useCreateProjectMutation, useUpdateProjectMutation } from "@app/queries/projectQueries";
import { useUsersQuery } from "@app/queries/userQueries";
import DynamicForm, { DynamicFormConfig } from "@components/commons/Form/DynamicForm";
import LogService from "@lib/services/LogService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

export interface ProjectFormProps {
  project?: ObjectType;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();

  const { data: users = [] } = useUsersQuery();
  const { notification } = App.useApp();

  const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
  const { mutateAsync: updateProjectMutation } = useUpdateProjectMutation();

  const isUpdatingProject = !!project;

  const updateProject = async (formData: ObjectType, form?: UseFormReturn) => {
    try {
      await updateProjectMutation(formData);
    } catch (error) {
      LogService.log(error);
      notification.error({ message: (error as BaseError).message });
    } finally {
      form?.reset();
      router.back();
    }
  };

  const createProject = async (formData: ObjectType, form?: UseFormReturn) => {
    try {
      await createProjectMutation(formData);
    } catch (error) {
      LogService.log(error);
      notification.error({ message: (error as BaseError).message });
    } finally {
      form?.reset();
      router.back();
    }
  };

  const onSubmit = async (formData: ObjectType, form?: UseFormReturn) => {
    if (isUpdatingProject) {
      return updateProject(formData);
    }
    return createProject(formData);
    // try {
    //   const { data }: any = isUpdatingProject ? await updateProject(formData) : await createProject(formData);
    //   if (!data?.success) throw new Error("Unable to save");

    //   notification.success({ message: "Save successfully" });
    //   router.push("/dashboard/projects");
    // } catch (error) {
    //   notification.error({ message: (error as BaseError).message });
    // }
  };

  const getConfig = useCallback((): DynamicFormConfig => {
    const userOptions = (users as ObjectType[]).map((user: ObjectType) => ({ label: user.name, value: user.id }));
    return {
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
            options: userOptions,
          },
          validate: { required: true, multiple: true },
        },
        {
          name: "description",
          type: "textarea",
          options: { placeholder: "Project Description" },
          validate: { required: true },
        },
      ],
    };
  }, [users]);

  return (
    <DynamicForm
      config={getConfig()}
      onSubmit={onSubmit}
      submitProps={{ className: "ml-auto mr-2" }}
      mapValues={project}
    />
  );
}
