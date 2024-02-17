"use client";

import { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import { useGetTasksQuery } from "@app/_store/slices/apiSlice";
import PageContainer from "@components/DashboardModule/PageContainer";
import Loader from "@components/commons/Loader";
import { BASE_URL } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import LogService from "@lib/services/LogService";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Task } from "@prisma/client";
import Button from "antd/es/button";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const TaskFormTitle = dynamic(async () => (await import("@components/TaskModule/TaskFormTitle")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskList = dynamic(async () => (await import("@components/TaskModule/TaskList")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskPreview = dynamic(async () => (await import("@components/TaskModule/TaskPreview")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Input = dynamic(async () => (await import("antd/es/input/Input")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Drawer = dynamic(async () => (await import("antd/es/drawer")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskForm = dynamic(async () => (await import("@app/_components/TaskModule/TaskForm")).default, {
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

function Page() {
  // Hooks
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const taskId = searchParams.get("taskId");

  const { data: tasks = [], isLoading: isTasksLoading } = useGetTasksQuery({ userId: currentUser?.id });
  const [selectedTask, setSelectedTask] = React.useState<TaskStatusAssignee | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(COMPONENT_MODE.VIEW);

  const isEditMode = mode === COMPONENT_MODE.EDIT;

  const createNewTask = () => {
    setSelectedTask(null);
    setMode(COMPONENT_MODE.EDIT);
    setOpenDrawer(true);
  };

  const toggleDrawer = useCallback(
    (value: boolean) => () => {
      if (!value) setSelectedTask(null);
      setOpenDrawer(value);
    },
    [setSelectedTask, setOpenDrawer],
  );
  const toggleMode = (value: string) => setMode(value);

  const onError = useCallback((error: Error) => {
    LogService.log((error as Error).message);
  }, []);

  const RenderTaskDetails = useMemo(() => {
    if (isEditMode) {
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
            name: "statusId",
            type: "select",
            options: {
              placeholder: "Select Status",
              remote: {
                url: `${BASE_URL}/api/status?type=task`,
                label: "name",
                value: "id",
              },
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
        <div className="px-1">
          <TaskForm
            onDone={toggleDrawer(false)}
            config={config}
            onError={onError}
            task={selectedTask as Task | undefined}
          />
        </div>
      );
    }
    return <TaskPreview task={selectedTask} />;
  }, [isEditMode, selectedTask, onError, toggleDrawer]);

  const onSelectTask = useCallback((task: TaskStatusAssignee) => {
    setMode(COMPONENT_MODE.VIEW);
    setSelectedTask(task);
    setOpenDrawer(true);
  }, []);

  useEffect(() => {
    if (tasks.length && taskId) {
      const task = tasks.find((task: Task) => task.id === Number(taskId));
      if (task) {
        onSelectTask(task);
        router.push(pathname, { scroll: false });
      }
    }
  }, [onSelectTask, pathname, router, taskId, tasks]);

  return (
    <PageContainer title="Tasks">
      <div className="mb-3 flex items-center">
        <Input size="large" placeholder="Find your task" className="grow mr-2 rounded-sm" prefix={<SearchOutlined />} />
        <div className="flex gap-3">
          <Button
            size="large"
            type="primary"
            onClick={createNewTask}
            className="rounded-sm"
            icon={<ControlPointOutlined className="!h-[0.875rem] !w-[0.875rem] !leading-none" />}>
            New Task
          </Button>
        </div>
      </div>
      <TaskList tasks={tasks} selectedTask={selectedTask} onSelectTask={onSelectTask} isLoading={isTasksLoading} />
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
