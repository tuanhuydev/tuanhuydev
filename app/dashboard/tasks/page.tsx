"use client";

import { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import BaseInput from "@app/_components/commons/Inputs/BaseInput";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import { useTasksQuery } from "@app/queries/taskQueries";
import PageContainer from "@components/DashboardModule/PageContainer";
import Loader from "@components/commons/Loader";
import { BASE_URL } from "@lib/configs/constants";
import LogService from "@lib/services/LogService";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Task } from "@prisma/client";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  CSSProperties,
  ChangeEventHandler,
  EventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const TaskFormTitle = dynamic(async () => (await import("@components/TaskModule/TaskFormTitle")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskList = dynamic(async () => (await import("@components/TaskModule/TaskList")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskPreview = dynamic(() => import("@components/TaskModule/TaskPreview"), { loading: () => <Loader /> });

const Drawer = dynamic(() => import("antd/es/drawer"), { loading: () => <Loader /> });

const TaskForm = dynamic(() => import("@app/_components/TaskModule/TaskForm"), { loading: () => <Loader /> });

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

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

function Page() {
  // Hooks
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const pathname = usePathname();
  const router = useRouter();

  const [selectedTask, setSelectedTask] = React.useState<TaskStatusAssignee | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(COMPONENT_MODE.VIEW);
  const [filter, setFilter] = useState<FilterType>({});

  const { data: tasks = [], refetch: refetchTasks, isLoading: isTasksLoading } = useTasksQuery(filter);

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
    [],
  );
  const toggleMode = (value: string) => setMode(value);

  const searchTasks: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTimeout(() => {
      const search = event.target.value;
      setFilter((filter) => ({ ...filter, search }));
      refetchTasks();
    }, 500);
  };

  const mutateTaskError = useCallback((error: Error) => {
    LogService.log((error as Error).message);
  }, []);

  const mutateTaskSuccess = useCallback(() => {
    refetchTasks();
    setOpenDrawer(false);
  }, [refetchTasks]);

  const RenderTaskDetails = useMemo(() => {
    if (isEditMode) {
      return (
        <div className="px-1">
          <TaskForm
            config={config}
            onDone={mutateTaskSuccess}
            onError={mutateTaskError}
            task={selectedTask as Task | undefined}
          />
        </div>
      );
    }
    return <TaskPreview task={selectedTask} />;
  }, [isEditMode, selectedTask, mutateTaskSuccess, mutateTaskError]);

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
