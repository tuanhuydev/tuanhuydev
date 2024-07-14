"use client";

import PageFilter from "../commons/PageFilter";
import { TaskStatusOptions, TaskTypeOptions } from "@app/_configs/constants";
import { useSprintQuery } from "@app/queries/sprintQueries";
import PageContainer from "@components/DashboardModule/PageContainer";
import { DynamicFormConfig, ElementType } from "@components/commons/Form/DynamicForm";
import Loader from "@components/commons/Loader";
import LogService from "@lib/services/LogService";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { CSSProperties, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";

const TaskFormTitle = dynamic(() => import("@components/TaskModule/TaskFormTitle"), {
  ssr: false,
  loading: () => <Loader />,
});

const TaskList = dynamic(() => import("@components/TaskModule/TaskList"), {
  ssr: false,
  loading: () => <Loader />,
});

const TaskPreview = dynamic(() => import("@components/TaskModule/TaskPreview"), { loading: () => <Loader /> });

const Drawer = dynamic(() => import("antd/es/drawer"), { loading: () => <Loader />, ssr: false });

const TaskForm = dynamic(() => import("@components/TaskModule/TaskForm"), { loading: () => <Loader /> });

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

interface TaskPageProps {
  project?: ObjectType;
  tasks: ObjectType[];
  selectedTaskId: string | null;
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onFilterChange?: (filter: FilterType) => void;
  loading: boolean;
}

function TaskPage({
  project = { name: "My Tasks", users: [] },
  tasks = [],
  selectedTaskId = null,
  onSearch,
  loading = false,
}: TaskPageProps) {
  // Hooks
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const router = useRouter();
  const { data: sprints } = useSprintQuery(project?.id);
  const [selectedTask, setSelectedTask] = React.useState<ObjectType | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(COMPONENT_MODE.VIEW);
  const [filter, setFilter] = useState<FilterType>({});

  const { users: projectUsers = [] } = project;

  const isEditMode = mode === COMPONENT_MODE.EDIT;

  const createNewTask = useCallback(() => {
    setSelectedTask(null);
    setMode(COMPONENT_MODE.EDIT);
    setOpenDrawer(true);
  }, []);

  const toggleDrawer = useCallback(
    (value: boolean) => () => {
      if (!value) setSelectedTask(null);
      setOpenDrawer(value);
    },
    [],
  );
  const toggleMode = useCallback((value: string) => setMode(value), []);

  const mutateTaskError = useCallback((error: Error) => {
    LogService.log((error as Error).message);
  }, []);

  const mutateTaskSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setOpenDrawer(false);
  }, [queryClient]);

  const TaskFormConfig = useMemo((): DynamicFormConfig => {
    const fields: ElementType[] = [
      {
        name: "title",
        type: "text",
        options: {
          placeholder: "Task Title",
        },
        validate: { required: true },
      },
      {
        name: "type",
        type: "select",
        options: {
          placeholder: "Task Type for example: Bug, Feature, etc.",
          options: TaskTypeOptions,
        },
      },
      {
        name: "status",
        type: "select",
        options: {
          placeholder: "Select Status",
          options: TaskStatusOptions,
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
    ];

    if (project?.id) {
      fields.splice(2, 0, {
        name: "assigneeId",
        type: "select",
        options: {
          placeholder: "Assignee",
          options: project.users as Array<ObjectType>,
        },
        validate: { required: true },
      });
    }

    return { fields };
  }, [project]);

  const RenderTaskDetails = useMemo(() => {
    if (isEditMode) {
      return (
        <div className="px-1">
          <TaskForm
            projectId={project?.id}
            config={TaskFormConfig}
            onDone={mutateTaskSuccess}
            onError={mutateTaskError}
            task={selectedTask as Task | undefined}
          />
        </div>
      );
    }

    const projectUser = projectUsers.find(({ value: userId }: SelectOption) => userId === selectedTask?.assigneeId);
    const taskSprint = sprints?.find(({ id }: ObjectType) => id === selectedTask?.sprintId);
    return <TaskPreview task={selectedTask} assignee={projectUser} sprint={taskSprint} />;
  }, [
    isEditMode,
    projectUsers,
    sprints,
    selectedTask,
    project?.id,
    TaskFormConfig,
    mutateTaskSuccess,
    mutateTaskError,
  ]);

  const onSelectTask = useCallback((task: ObjectType) => {
    setMode(COMPONENT_MODE.VIEW);
    setSelectedTask(task);
    setOpenDrawer(true);
  }, []);

  useEffect(() => {
    if (tasks.length && selectedTaskId) {
      const task = tasks.find((task: ObjectType) => String(task.id) === selectedTaskId);
      if (task) {
        onSelectTask(task);
        router.push(pathname, { scroll: false });
      }
    }
  }, [onSelectTask, pathname, router, selectedTaskId, tasks]);

  useEffect(() => {
    if (filter) setFilter(filter);
  }, [filter]);

  return (
    <PageContainer title={project.name} goBack={!!project.name}>
      <PageFilter onSearch={onSearch} onNew={createNewTask} createLabel="New Task" />
      <TaskList
        projectId={project.id}
        tasks={tasks}
        selectedTask={selectedTask}
        onSelectTask={onSelectTask}
        isLoading={loading}
      />
      <Drawer size="large" placement="right" getContainer={false} destroyOnClose styles={drawerStyle} open={openDrawer}>
        <TaskFormTitle
          task={selectedTask}
          mode={mode as "VIEW" | "EDIT"}
          allowEditTask={!!selectedTask}
          onClose={toggleDrawer(false)}
          onToggle={toggleMode}
        />
        {RenderTaskDetails}
      </Drawer>
    </PageContainer>
  );
}

export default TaskPage;
