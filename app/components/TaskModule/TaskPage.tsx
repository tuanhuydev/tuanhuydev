"use client";

import { TaskStatusOptions, TaskTypeOptions } from "@app/_utils/constants";
import PageContainer from "@app/components/DashboardModule/PageContainer";
import { DynamicFormConfig, Field } from "@app/components/commons/Form/DynamicForm";
import Loader from "@app/components/commons/Loader";
import PageFilter from "@app/components/commons/PageFilter";
import { useCurrentUserPermission } from "@app/queries/permissionQueries";
import { useSprintQuery } from "@app/queries/sprintQueries";
import { useUsersQuery } from "@app/queries/userQueries";
import LogService from "@lib/services/LogService";
import { Drawer } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

const TaskFormTitle = dynamic(() => import("@app/components/TaskModule/TaskFormTitle"), {
  ssr: false,
  loading: () => <Loader />,
});

const TaskList = dynamic(() => import("@app/components/TaskModule/TaskList"), {
  ssr: false,
  loading: () => <Loader />,
});

const TaskPreview = dynamic(() => import("@app/components/TaskModule/TaskPreview"), { loading: () => <Loader /> });

const TaskForm = dynamic(() => import("@app/components/TaskModule/TaskForm"), { loading: () => <Loader /> });

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

interface TaskPageProps {
  project?: ObjectType;
  tasks?: ObjectType[];
  selectedTaskId?: string | null;
  allowSubTasks?: boolean;
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (filter: FilterType) => void;
  loading?: boolean;
}

function TaskPage({
  project = { name: "My Tasks", users: [] },
  tasks = [],
  selectedTaskId = null,
  onSearch,
  allowSubTasks = false,
  loading = false,
}: TaskPageProps) {
  // Hooks
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsersQuery();
  const { data: sprints = [] } = useSprintQuery(project?.id);
  const { data: permissions = [] } = useCurrentUserPermission();
  const pathname = usePathname();
  const router = useRouter();

  // States
  const [meta, setMeta] = useState({
    selectedTask: null as ObjectType | null,
    openDrawer: false,
    mode: COMPONENT_MODE.VIEW,
  });

  // Constants
  const { selectedTask, openDrawer, mode } = meta;
  const isEditMode = mode === COMPONENT_MODE.EDIT;
  const allowCreateTask = project?.id
    ? (permissions as Array<ObjectType>).some((permission: ObjectType = {}) => {
        const { action = "", resourceId = "", type = "" } = permission;
        return action === "create" && type === "task" && ["*", project?.id].includes(resourceId);
      })
    : true;

  const projectUsers = useMemo(() => {
    const { users: projectUserIds = [] } = project;
    if (!(projectUserIds as Array<string>).length) return [];

    return (users as Array<ObjectType>)
      .filter(({ id }: ObjectType) => (projectUserIds as Array<string>).includes(id))
      .map(({ id, name }: ObjectType) => ({ label: name, value: id }));
  }, [project, users]);

  const createNewTask = useCallback(() => {
    setMeta((prevState) => ({
      ...prevState,
      selectedTask: null,
      mode: COMPONENT_MODE.EDIT,
      openDrawer: true,
    }));
  }, []);

  const toggleDrawer = useCallback(
    (value: boolean) => () => {
      setMeta((prevState) => ({
        ...prevState,
        selectedTask: value ? prevState.selectedTask : null,
        openDrawer: value,
      }));
    },
    [],
  );

  const toggleMode = useCallback((value: string) => {
    setMeta((prevState) => ({ ...prevState, mode: value }));
  }, []);

  const mutateTaskError = useCallback((error: Error) => {
    LogService.log(error.message);
  }, []);

  const mutateTaskSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setMeta((prevState) => ({ ...prevState, openDrawer: false }));
  }, [queryClient]);

  const TaskFormConfig = useMemo((): DynamicFormConfig => {
    const fields: Field[] = [
      {
        name: "title",
        type: "text",
        options: { placeholder: "Task Title" },
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
          options: projectUsers,
        },
        validate: { required: true },
      });
    }
    return { fields };
  }, [project?.id, projectUsers]);

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
    setMeta((prevState) => ({
      ...prevState,
      selectedTask: task,
      mode: COMPONENT_MODE.VIEW,
      openDrawer: true,
    }));
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

  return (
    <PageContainer title={project.name} goBack={!!project.name}>
      <PageFilter onSearch={onSearch} onNew={createNewTask} createLabel="New Task" allowCreate={allowCreateTask} />
      <TaskList
        projectId={project?.id}
        tasks={tasks}
        selectedTask={selectedTask}
        onSelectTask={onSelectTask}
        isLoading={loading}
      />
      <Drawer
        open={openDrawer}
        aria-hidden="false"
        anchor="right"
        PaperProps={{
          style: { width: "35%" },
        }}
        onClose={toggleDrawer(false)}>
        <TaskFormTitle
          task={selectedTask}
          allowSubTask={!!selectedTask && allowSubTasks}
          config={TaskFormConfig}
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
