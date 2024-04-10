"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import TaskFormTitle from "@app/_components/TaskModule/TaskFormTitle";
import TaskPreview from "@app/_components/TaskModule/TaskPreview";
import { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import BaseInput from "@app/_components/commons/Inputs/BaseInput";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import { useProjectQuery, useProjectTasks } from "@app/queries/projectQueries";
import { useStatusQuery } from "@app/queries/statusQueries";
import { useProjectUsers } from "@app/queries/userQueries";
import Loader from "@components/commons/Loader";
import LogService from "@lib/services/LogService";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Status, Task, User } from "@prisma/client";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { CSSProperties, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";

const TaskForm = dynamic(async () => (await import("@app/_components/TaskModule/TaskForm")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskRow = dynamic(async () => (await import("@app/_components/TaskModule/TaskRow")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Drawer = dynamic(async () => (await import("antd/es/drawer")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Empty = dynamic(async () => (await import("antd/es/empty")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

function Page({ params }: any) {
  const { projectId } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const taskId = searchParams.get("taskId");

  const [filter, setFilter] = useState<FilterType>({});

  const { data: project, isLoading: isProjectLoading } = useProjectQuery(projectId);
  const {
    data: tasks = [],
    refetch: refetchTasks,
    isLoading: isProjectTaskLoading,
  } = useProjectTasks(projectId, filter);
  const { data: status = [] } = useStatusQuery({ type: "task" });
  const { data: projectUsers = [] } = useProjectUsers(projectId);

  const [selectedTask, setSelectedTask] = useState<TaskStatusAssignee | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(COMPONENT_MODE.VIEW);

  const isEditMode = mode === COMPONENT_MODE.EDIT;

  const toggleDrawer = useCallback(
    (value: boolean) => () => {
      if (!value) setSelectedTask(null);
      setOpenDrawer(value);
    },
    [setSelectedTask, setOpenDrawer],
  );

  const createNewTask = () => {
    setMode(COMPONENT_MODE.EDIT);
    setSelectedTask(null);
    setOpenDrawer(true);
  };

  const onSelectTask = useCallback((task: TaskStatusAssignee) => {
    setMode(COMPONENT_MODE.VIEW);
    setSelectedTask(task);
    setOpenDrawer(true);
  }, []);

  const searchTasks: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTimeout(() => {
      const search = event.target.value;
      setFilter((filter) => {
        if (search?.length) return { ...filter, search };

        delete filter?.search;
        return filter;
      });
      refetchTasks();
    }, 500);
  };

  const toggleMode = (value: string) => setMode(value);

  const onError = useCallback((error: Error) => {
    LogService.log((error as Error).message);
  }, []);

  const taskFormConfig = useMemo((): DynamicFormConfig => {
    const statusOptions = (status as Status[]).map(({ name, id }: Status) => ({ label: name, value: id }));
    const projectUserOptions = (projectUsers as User[]).map((user: User) => ({ label: user.name, value: user.id }));
    return {
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
          name: "assigneeId",
          type: "select",
          className: "w-1/2",
          options: {
            placeholder: "Select Assignee",
            options: projectUserOptions,
          },
        },
        {
          name: "statusId",
          type: "select",
          className: "w-1/2",
          options: {
            placeholder: "Select Status",
            options: statusOptions,
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
  }, [status, projectUsers]);

  const RenderTaskGroup = useMemo(() => {
    if (!isProjectTaskLoading && !tasks.length) return <Empty className="my-36" />;
    if (isProjectTaskLoading) return <Loader />;

    return tasks.map((task: TaskStatusAssignee) => (
      <TaskRow active={task.id === selectedTask?.id} onSelect={onSelectTask} showAssignee task={task} key={task.id} />
    ));
  }, [isProjectTaskLoading, tasks, selectedTask?.id, onSelectTask]);

  useEffect(() => {
    if (tasks.length && taskId) {
      const task = tasks.find((task: Task) => task.id === Number(taskId));
      if (task) {
        onSelectTask(task);
        router.push(pathname, { scroll: false });
      }
    }
  }, [pathname, router, searchParams, taskId, tasks, onSelectTask]);

  const RenderTaskDetails = useMemo(() => {
    if (isEditMode) {
      return (
        <div className="px-1">
          <TaskForm
            config={taskFormConfig}
            projectId={projectId}
            onDone={toggleDrawer(false)}
            onError={onError}
            task={selectedTask as Task | undefined}
          />
        </div>
      );
    }
    return <TaskPreview task={selectedTask} />;
  }, [isEditMode, selectedTask, taskFormConfig, projectId, toggleDrawer, onError]);

  return (
    <PageContainer title={`${project?.name}'s tasks`} goBack>
      <div className="mb-3 flex gap-2 items-center">
        <BaseInput
          placeholder="Find your task"
          onChange={searchTasks}
          className="grow mr-2 rounded-sm"
          startAdornment={<SearchOutlined />}
        />
        <div className="flex gap-3">
          <BaseButton onClick={createNewTask} label="New Task" icon={<ControlPointOutlined fontSize="small" />} />
        </div>
      </div>
      <div className="grow overflow-auto pb-3">{RenderTaskGroup}</div>
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

export default Page;
