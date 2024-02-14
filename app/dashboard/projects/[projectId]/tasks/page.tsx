"use client";

import TaskFormTitle from "@app/_components/TaskModule/TaskFormTitle";
import TaskPreview from "@app/_components/TaskModule/TaskPreview";
import { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import WithPermission from "@app/_components/commons/hocs/WithPermission";
import BaseLabel from "@components/commons/BaseLabel";
import Loader from "@components/commons/Loader";
import { BASE_URL, EMPTY_STRING } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import LogService from "@lib/services/LogService";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Task } from "@prisma/client";
import { useGetProjectQuery, useGetTasksByProjectQuery } from "@store/slices/apiSlice";
import { CollapseProps } from "antd/es/collapse";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { CSSProperties, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";

const Input = dynamic(async () => (await import("antd/es/input")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TaskForm = dynamic(async () => (await import("@app/_components/TaskModule/TaskForm")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const TaskRow = dynamic(async () => (await import("@app/_components/TaskModule/TaskRow")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Button = dynamic(async () => (await import("antd/es/button")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Collapse = dynamic(async () => (await import("antd/es/collapse")).default, {
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

const panelStyle: CSSProperties = {
  fontWeight: 500,
  textTransform: "capitalize",
};
const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

function Page({ params, setTitle, setGoBack }: any) {
  const { projectId } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const taskId = searchParams.get("taskId");

  const currentUser = useSelector((state: RootState) => state.auth.currentUser) || {};
  const { resources } = currentUser;

  const { data: project } = useGetProjectQuery(projectId);
  const { data: tasks = [], isLoading: isProjectTaskLoading } = useGetTasksByProjectQuery(projectId);

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

  const toggleMode = (value: string) => setMode(value);

  const renderTasks = useCallback(() => {
    return tasks.map((task: TaskStatusAssignee) => (
      <TaskRow active={task.id === selectedTask?.id} onSelect={onSelectTask} task={task} key={task.id} />
    ));
  }, [selectedTask?.id, tasks, onSelectTask]);

  const onError = useCallback((error: Error) => {
    LogService.log((error as Error).message);
  }, []);

  const RenderTaskGroup = useMemo(() => {
    if (!isProjectTaskLoading && !tasks.length) return <Empty className="my-36" />;
    if (isProjectTaskLoading) return <Loader />;

    const taskGroups: CollapseProps["items"] = [
      {
        key: "backlog",
        label: "[ backlog ]",
        children: renderTasks(),
        style: panelStyle,
      },
    ];

    return <Collapse items={taskGroups} bordered={false} ghost defaultActiveKey={["backlog"]} />;
  }, [isProjectTaskLoading, tasks.length, renderTasks]);

  useEffect(() => {
    if (setTitle) setTitle(`${project?.name}'s tasks`);
    if (setGoBack) setGoBack(true);
  }, [setTitle, project?.name, setGoBack]);

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
    const taskFormConfig: DynamicFormConfig = {
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
            defaultOption: { label: "Unassigned", value: null },
            placeholder: "Select Assignee",
            remote: {
              url: `${BASE_URL}/api/users`,
              label: "name",
              value: "id",
            },
          },
        },
        {
          name: "statusId",
          type: "select",
          className: "w-1/2",
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
  }, [isEditMode, projectId, toggleDrawer, onError, selectedTask]);

  return (
    <Fragment>
      <div className="mb-3 flex items-center">
        <Input size="large" placeholder="Find your task" className="grow mr-2 rounded-sm" prefix={<SearchOutlined />} />
        <div className="flex gap-3">
          {resources.has(Permissions.CREATE_TASK) && (
            <Button
              size="large"
              type="primary"
              onClick={createNewTask}
              className="rounded-sm"
              icon={<ControlPointOutlined className="!h-[0.875rem] !w-[0.875rem] !leading-none" />}>
              New Task
            </Button>
          )}
        </div>
      </div>
      <div className="grow overflow-auto pb-3">{RenderTaskGroup}</div>
      <Drawer size="large" placement="right" getContainer={false} destroyOnClose styles={drawerStyle} open={openDrawer}>
        <TaskFormTitle
          task={selectedTask}
          mode={mode as "VIEW" | "EDIT"}
          allowEditTask={selectedTask && resources.has(Permissions.EDIT_TASK)}
          onClose={toggleDrawer(false)}
          onToggle={toggleMode}
        />
        {RenderTaskDetails}
      </Drawer>
    </Fragment>
  );
}

export default WithPermission(Page, Permissions.VIEW_TASKS);
