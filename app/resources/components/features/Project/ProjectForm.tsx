"use client";

import { Project } from "@lib/types/project";
import { Card, CardContent } from "@resources/components/common/Card";
import DynamicForm, { DynamicFormConfig } from "@resources/components/form/DynamicForm";
import { useCreateProjectMutation, useUpdateProjectMutation } from "@resources/queries/projectQueries";
import { useUsersQuery } from "@resources/queries/userQueries";
import { ProjectStatus, ProjectType } from "lib/interfaces/enums";
import { toCapitalize } from "lib/utils/helper";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import LogService from "server/services/LogService";

export interface ProjectFormProps {
  project?: Project;
}

function createOptions<T extends string>(enumObj: Record<string, T>, formatter: (value: T) => string) {
  return Object.values(enumObj)
    .filter((value) => typeof value === "string")
    .map((value) => ({
      label: formatter(value),
      value,
    }));
}

const projectTypeOptions = createOptions(ProjectType, toCapitalize);

const projectStatusOptions = createOptions(ProjectStatus, toCapitalize);

export default function ProjectForm({ project }: ProjectFormProps) {
  // Hooks
  const router = useRouter();
  const { data: users = [] } = useUsersQuery({ projectId: project?.id } as Record<string, unknown>);
  const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
  const { mutateAsync: updateProjectMutation } = useUpdateProjectMutation();

  // State
  const [form, setForm] = useState<UseFormReturn | null>(null);

  const handleProjectMutation = useCallback(
    async (formData: Record<string, unknown>, mutationFn: (data: Record<string, unknown>) => Promise<unknown>) => {
      try {
        await mutationFn(formData);
        router.push("/dashboard/projects");
      } catch (error) {
        LogService.log(error);
      } finally {
        if (form) form?.reset();
      }
    },
    [router, form],
  );

  const onSubmit = useCallback(
    async (formData: Record<string, unknown>) => {
      const mutationFn = project?.id ? updateProjectMutation : createProjectMutation;
      await handleProjectMutation(formData, mutationFn);
    },
    [project?.id, updateProjectMutation, createProjectMutation, handleProjectMutation],
  );

  const config = useMemo((): DynamicFormConfig => {
    const userOptions = (users as Record<string, unknown>[]).map((user: Record<string, unknown>) => {
      const userName = user.name;
      const userId = user.id;
      return {
        label: typeof userName === "string" || typeof userName === "number" ? String(userName) : "",
        value: typeof userId === "string" || typeof userId === "number" ? String(userId) : "",
      };
    });
    return {
      fields: [
        {
          name: "Basic Information",
          fields: [
            {
              name: "name",
              label: "Project Name",
              type: "text",
              options: {
                placeholder: "Enter project name",
              },
              validate: { required: true },
              className: "w-full lg:w-1/2 lg:pr-2.5",
            },
            {
              name: "clientName",
              label: "Client Name",
              type: "text",
              options: {
                placeholder: "Enter client name",
              },
              validate: { required: true },
              className: "w-full lg:w-1/2 lg:pl-2.5",
            },
            {
              name: "description",
              label: "Project Description",
              type: "textarea",
              options: { placeholder: "Enter a detailed description of the project", rows: 6 },
              validate: { required: true },
            },
          ],
        },
        {
          name: "Project Configuration",
          fields: [
            {
              name: "type",
              label: "Project Type",
              type: "select",
              options: {
                placeholder: "Select project type",
                options: projectTypeOptions,
              },
              validate: { required: true },
              className: "w-full lg:w-1/2 lg:pr-2.5",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: {
                placeholder: "Select status",
                options: projectStatusOptions,
              },
              validate: { required: true },
              className: "w-full lg:w-1/2 lg:pl-2.5",
            },
            {
              name: "startDate",
              label: "Start Date",
              type: "datepicker",
              options: {
                placeholder: "Select start date",
              },
              validate: { required: true },
              className: "w-full lg:w-1/2 lg:pr-2.5",
            },
            {
              name: "endDate",
              label: "End Date",
              type: "datepicker",
              options: {
                placeholder: "Select end date",
              },
              validate: { required: true, min: "startDate" },
              className: "w-full lg:w-1/2 lg:pl-2.5",
            },
            {
              name: "users",
              label: "Team Members",
              type: "select",
              options: {
                placeholder: "Select team members",
                mode: "multiple",
                options: userOptions,
              },
              validate: { required: true, multiple: true },
            },
          ],
        },
      ],
      submitProps: {
        className: "w-full sm:w-auto sm:ml-auto",
      },
      setForm,
    };
  }, [users]);

  return (
    <Card className="w-full lg:w-3/4">
      <CardContent className="px-6 py-4 sm:px-8">
        <DynamicForm config={config} onSubmit={onSubmit} mapValues={project as unknown as Record<string, unknown>} />
      </CardContent>
    </Card>
  );
}
