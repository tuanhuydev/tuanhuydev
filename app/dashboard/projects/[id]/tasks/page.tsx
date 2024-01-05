"use client";

import Loader from "@lib/components/commons/Loader";
import WithAuth from "@lib/components/hocs/WithAuth";
import { EMPTY_STRING } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { useGetProjectQuery, useGetTasksQuery } from "@lib/store/slices/apiSlice";
import { Task } from "@prisma/client";
import { App, CollapseProps } from "antd";
import dynamic from "next/dynamic";
import React, { CSSProperties, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const SearchOutlined = dynamic(async () => (await import("@mui/icons-material/SearchOutlined")).default, {
  ssr: false,
});
const EditOffOutlined = dynamic(async () => (await import("@mui/icons-material/EditOffOutlined")).default, {
  ssr: false,
});
const EditOutlined = dynamic(async () => (await import("@mui/icons-material/EditOutlined")).default, {
  ssr: false,
});
const CloseOutlined = dynamic(async () => (await import("@mui/icons-material/CloseOutlined")).default, {
  ssr: false,
});
const ControlPointOutlined = dynamic(async () => (await import("@mui/icons-material/ControlPointOutlined")).default, {
  ssr: false,
});
const Input = dynamic(async () => (await import("antd/es/input")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const BaseMarkdown = dynamic(async () => (await import("@lib/components/commons/BaseMarkdown")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const TaskForm = dynamic(async () => (await import("@lib/TaskModule/TaskForm")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const TaskRow = dynamic(async () => (await import("@lib/TaskModule/TaskRow")).default, {
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

function Page({ params, setTitle, setPageKey, setGoBack }: any) {
  const { id } = params;
  const { notification } = App.useApp();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser) || {};
  const { resources } = currentUser;

  const { data: project, isLoading: isProjectLoading } = useGetProjectQuery(id);
  const { data: tasks = [], isLoading: isProjectTaskLoading } = useGetTasksQuery(id);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(COMPONENT_MODE.VIEW);

  const drawerTitle = selectedTask ? `Task #${selectedTask.id}` : "Create new task";
  const isEditMode = mode === COMPONENT_MODE.EDIT;

  const toggleDrawer = (value: boolean) => () => {
    if (!value) setSelectedTask(null);
    setOpenDrawer(value);
  };

  const toggleMode = (value: string) => () => setMode(value);

  const createNewTask = () => {
    setMode(COMPONENT_MODE.EDIT);
    setSelectedTask(null);
    setOpenDrawer(true);
  };

  const viewTask = (task: Task) => {
    setMode(COMPONENT_MODE.VIEW);
    setSelectedTask(task);
    setOpenDrawer(true);
  };

  const copyTaskLink = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(window.location.href);
  };

  const renderTasks = useCallback(() => {
    return tasks.map((task: Task) => (
      <TaskRow active={task.id === selectedTask?.id} onView={viewTask} task={task} projectId={id} key={task.id} />
    ));
  }, [id, selectedTask?.id, tasks]);

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
  }, [isEditMode, mode, resources, selectedTask]);

  const onError = useCallback(
    (error: Error) => {
      notification.error({
        message: "Error",
        description: error.message,
        placement: "topRight",
      });
    },
    [notification],
  );

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

  const RenderTaskDetail = useMemo(() => {
    if (isEditMode) {
      return (
        <div className="px-1">
          <TaskForm
            projectId={id}
            onDone={toggleDrawer(false)}
            onError={onError}
            task={selectedTask as Task | undefined}
          />
        </div>
      );
    }
    return (
      <div className="px-3">
        <div className="flex gap-3 relative">
          <h1 className="text-lg capitalize px-3 m-0 font-medium truncate">{selectedTask?.title ?? EMPTY_STRING}</h1>
        </div>
        <BaseMarkdown value={selectedTask?.description ?? EMPTY_STRING} readOnly></BaseMarkdown>
      </div>
    );
  }, [id, isEditMode, onError, selectedTask]);

  useEffect(() => {
    if (setTitle) setTitle(`${project?.name}'s tasks`);
    if (setPageKey) setPageKey(Permissions.VIEW_TASKS);
    if (setGoBack) setGoBack(true);
  }, [setTitle, setPageKey, project?.name, setGoBack]);

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
      <Drawer size="large" placement="right" destroyOnClose styles={drawerStyle} open={openDrawer}>
        <div className="bg-slate-700 mb-3 flex justify-between">
          <div className="flex items-baseline">
            <h1
              className={`my-0 mr-3 px-3 py-2 bg-primary text-white text-base cursor-pointer ${
                selectedTask ? "hover:underline" : ""
              }`}
              onClick={copyTaskLink}>
              {drawerTitle}
            </h1>
            {selectedTask && (
              <span
                className="px-2 py-1 text-white rounded-md flex items-center bg-blue-500 leading-none"
                style={{ background: (selectedTask as any)?.status?.color ?? "transparent" }}>
                {(selectedTask as any)?.status?.name}
              </span>
            )}
          </div>
          {RenderDrawerExtra}
        </div>
        {RenderTaskDetail}
      </Drawer>
    </Fragment>
  );
}

export default WithAuth(Page);
