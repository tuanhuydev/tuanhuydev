"use client";

import { useCreateProjectMutation, useUpdateProjectMutation } from "@app/_queries/projectQueries";
import { useUsersQuery } from "@app/_queries/userQueries";
import DynamicFormV2, { DynamicFormV2Config } from "@app/components/commons/FormV2/DynamicFormV2";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectStatus, ProjectType } from "lib/interfaces/enums";
import { toCapitalize } from "lib/utils/helper";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import LogService from "server/services/LogService";

export interface ProjectFormProps {
  project?: ObjectType;
}

function createOptions<T extends string>(enumObj: Record<string, T>, formatter: (value: T) => string) {
  return Object.values(enumObj)
    .filter((value) => typeof value === "string")
    .map((value) => ({
      label: formatter(value as T),
      value,
    }));
}

const projectTypeOptions = createOptions(ProjectType, toCapitalize);

const projectStatusOptions = createOptions(ProjectStatus, toCapitalize);

export default function ProjectForm({ project }: ProjectFormProps) {
  // Hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsersQuery({ projectId: project?.id });
  const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
  const { mutateAsync: updateProjectMutation } = useUpdateProjectMutation();

  // State
  const [form, setForm] = useState<UseFormReturn | null>(null);

  const handleProjectMutation = async (formData: ObjectType, mutationFn: (data: ObjectType) => Promise<any>) => {
    try {
      await mutationFn(formData);
      router.push("/dashboard/projects");
    } catch (error) {
      LogService.log(error);
    } finally {
      if (form) form?.reset();
    }
  };

  const onSubmit = async (formData: ObjectType) => {
    const mutationFn = project ? updateProjectMutation : createProjectMutation;
    await handleProjectMutation(formData, mutationFn);
  };

  const config = useMemo((): DynamicFormV2Config => {
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
            placeholder: "Select members...",
            mode: "multiple",
            options: userOptions,
          },
          validate: { required: true, multiple: true },
        },
        {
          name: "type",
          type: "select",
          options: {
            placeholder: "Select type...",
            options: projectTypeOptions,
          },
          className: "w-1/2",
          validate: { required: true },
        },
        {
          name: "status",
          type: "select",
          options: {
            placeholder: "Select status...",
            options: projectStatusOptions,
          },
          validate: { required: true },
          className: "w-1/2",
        },
        {
          name: "description",
          type: "textarea",
          options: { placeholder: "Project Description" },
          validate: { required: true },
        },
      ],
      submitProps: {
        className: "ml-auto mr-2",
      },
      setForm,
    };
  }, [users]);

  return <DynamicFormV2 config={config} onSubmit={onSubmit} mapValues={project} />;
}
