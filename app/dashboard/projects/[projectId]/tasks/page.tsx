"use client";

import WithAuth from "@app/_components/commons/hocs/WithAuth";
import WithTooltip from "@app/_components/commons/hocs/WithTooltip";
import Badge from "@components/commons/Badge";
import BaseLabel from "@components/commons/BaseLabel";
import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import LogService from "@lib/services/LogService";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { TaskStatusAssignee } from "@lib/shared/interfaces/prisma";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Task } from "@prisma/client";
import { useGetProjectQuery, useGetTasksQuery } from "@store/slices/apiSlice";
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
  const { data: tasks = [], isLoading: isProjectTaskLoading } = useGetTasksQuery(projectId);

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

  const toggleMode = (value: string) => () => setMode(value);

  const createNewTask = () => {
    setMode(COMPONENT_MODE.EDIT);
    setSelectedTask(null);
    setOpenDrawer(true);
  };

  const viewTask = useCallback((task: TaskStatusAssignee) => {
    setMode(COMPONENT_MODE.VIEW);
    setSelectedTask(task);
    setOpenDrawer(true);
  }, []);

  const renderTasks = useCallback(() => {
    return tasks.map((task: TaskStatusAssignee) => (
      <TaskRow
        active={task.id === selectedTask?.id}
        onView={viewTask}
        task={task}
        projectId={projectId}
        key={task.id}
      />
    ));
  }, [projectId, selectedTask?.id, tasks, viewTask]);

  const RenderDrawerExtra = useMemo(() => {
    const isViewMode = mode === COMPONENT_MODE.VIEW;
    const allowEditTask = selectedTask && resources.has(Permissions.EDIT_TASK);

    return (
      <div className="px-2 flex items-center">
        {allowEditTask && (
          <Fragment>
            {isViewMode && (
              <Button
                type="link"
                onClick={toggleMode(COMPONENT_MODE.EDIT)}
                className="!leading-none"
                icon={<EditOutlined className="!text-lg text-white" />}
              />
            )}
            {isEditMode && (
              <Button
                type="link"
                className="!leading-none"
                onClick={toggleMode(COMPONENT_MODE.VIEW)}
                icon={<EditOffOutlined className="!text-lg text-white" />}
              />
            )}
          </Fragment>
        )}
        <Button
          type="primary"
          onClick={toggleDrawer(false)}
          className="!leading-none"
          icon={<CloseOutlined className="!text-lg text-white" />}
        />
      </div>
    );
  }, [isEditMode, mode, resources, selectedTask, toggleDrawer]);

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
        viewTask(task);
        router.push(pathname, { scroll: false });
      }
    }
  }, [pathname, router, searchParams, taskId, tasks, viewTask]);

  const RenderHeader = useMemo(() => {
    const titleStyles = "my-0 mr-3 px-3 py-2 bg-primary text-white text-base";
    if (!selectedTask) return <h1 className={titleStyles}>Create new task</h1>;

    return (
      <WithTooltip content={`${window.location.href}?taskId=${selectedTask?.id}`} title="Copy task link">
        <h1 className={`${titleStyles} hover:underline`}>{`Task #${selectedTask.id}`}</h1>
      </WithTooltip>
    );
  }, [selectedTask]);

  const RenderTaskDetails = useMemo(() => {
    if (isEditMode) {
      return (
        <div className="px-1">
          <TaskForm
            projectId={projectId}
            onDone={toggleDrawer(false)}
            onError={onError}
            task={selectedTask as Task | undefined}
          />
        </div>
      );
    } else {
      return (
        <div className="p-3">
          <h1 className="text-3xl capitalize px-0 m-0 mb-2 font-bold truncate">
            {selectedTask?.title ?? EMPTY_STRING}
          </h1>
          <div className="flex items-center gap-3 mb-2 text-base">
            <BaseLabel>Assignee</BaseLabel>
            {selectedTask?.assignee?.name ?? "Unassigned"}
          </div>
          <div className="mt-4 text-base">
            <ReactMarkdown>{selectedTask?.description ?? EMPTY_STRING}</ReactMarkdown>
          </div>
        </div>
      );
    }
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
        <div className="bg-slate-700 mb-3 flex justify-between">
          <div className="flex items-baseline">
            {RenderHeader}
            {selectedTask && !isEditMode && (
              <Badge
                color={(selectedTask as any)?.status?.color ?? "transparent"}
                value={(selectedTask as any)?.status?.name ?? EMPTY_STRING}
              />
            )}
          </div>
          {RenderDrawerExtra}
        </div>
        {RenderTaskDetails}
      </Drawer>
    </Fragment>
  );
}

export default WithAuth(Page, Permissions.VIEW_TASKS);
