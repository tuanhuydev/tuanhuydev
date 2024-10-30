"use client";

import DynamicForm, { DynamicFormConfig } from "@app/components/commons/Form/DynamicForm";
import { useCreateProjectMutation, useUpdateProjectMutation } from "@app/queries/projectQueries";
import { useUsersQuery } from "@app/queries/userQueries";
import LogService from "@lib/services/LogService";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface ProjectFormProps {
  project?: ObjectType;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  // Hooks
  const router = useRouter();

  const { data: users = [] } = useUsersQuery({ projectId: project?.id });
  const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
  const { mutateAsync: updateProjectMutation } = useUpdateProjectMutation();

  // State
  const [form, setForm] = useState<UseFormReturn | null>(null);

  const handleProjectMutation = async (formData: ObjectType, mutationFn: (data: ObjectType) => Promise<any>) => {
    try {
      await mutationFn(formData);
      router.back();
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

  const config = useMemo((): DynamicFormConfig => {
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
      submitProps: {
        className: "ml-auto mr-2",
      },
      setForm,
    };
  }, [users]);

  return <DynamicForm config={config} onSubmit={onSubmit} mapValues={project} />;
}
