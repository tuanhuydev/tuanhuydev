"use client";

import PageContainer from "@lib/DashboardModule/PageContainer";
import TaskForm from "@lib/TaskModule/TaskForm";
import TaskRow from "@lib/TaskModule/TaskRow";
import Loader from "@lib/components/commons/Loader";
import { useGetProjectQuery, useGetTasksQuery } from "@lib/store/slices/apiSlice";
import { Task } from "@prisma/client";
import { Input, Button, CollapseProps, Collapse, Empty, Drawer } from "antd";
import dynamic from "next/dynamic";
import React, { CSSProperties, useMemo, useState } from "react";

const SearchOutlined = dynamic(async () => (await import("@ant-design/icons")).SearchOutlined, {
  ssr: false,
  loading: () => <Loader />,
});
const PlusCircleOutlined = dynamic(async () => (await import("@ant-design/icons")).PlusCircleOutlined, {
  ssr: false,
  loading: () => <Loader />,
});
const BuildOutlined = dynamic(async () => (await import("@ant-design/icons")).BuildOutlined, {
  ssr: false,
  loading: () => <Loader />,
});

const panelStyle: CSSProperties = {
  fontWeight: 500,
  textTransform: "capitalize",
};

export default function Page({ params }: any) {
  const { id } = params;
  const { data: project, isLoading: isProjectLoading } = useGetProjectQuery(id);
  const { data: tasks = [], isLoading: isProjectTaskLoading } = useGetTasksQuery(id);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const toggleDrawer = (value: boolean) => () => {
    if (!value) setSelectedTask(null);
    setOpenDrawer(value);
  };

  const getStatus = () => {
    const statuses = fetch("");
  };

  const newTask = () => {
    setSelectedTask(null);
    setOpenDrawer(true);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setOpenDrawer(true);
  };

  const RenderTasks = useMemo(() => {
    return tasks.map((task: Task) => (
      <TaskRow active={task.id === selectedTask?.id} onView={handleView} task={task} projectId={id} key={task.id} />
    ));
  }, [id, selectedTask?.id, tasks]);

  const items: CollapseProps["items"] = [
    {
      key: "backlog",
      label: "[ backlog ]",
      children: RenderTasks,
      style: panelStyle,
    },
  ];

  return (
    <PageContainer
      loading={isProjectLoading && isProjectTaskLoading}
      title={`${project?.name}'s tasks`}
      pageKey="Projects"
      goBack>
      <div className="mb-3 flex items-center">
        <Input size="large" placeholder="Find your task" className="grow mr-2 rounded-sm" prefix={<SearchOutlined />} />
        <div className="flex gap-3">
          <Button size="large" type="primary" onClick={newTask} className="rounded-sm" icon={<PlusCircleOutlined />}>
            New Task
          </Button>
          <Button
            size="large"
            onClick={() => console.log("new sprint")}
            className="rounded-sm"
            icon={<BuildOutlined />}>
            New Sprint
          </Button>
        </div>
      </div>
      <div className="grow overflow-auto pb-3">
        {isProjectTaskLoading ? (
          <Loader />
        ) : tasks.length ? (
          <Collapse items={items} bordered={false} ghost defaultActiveKey={["backlog"]} />
        ) : (
          <Empty className="my-36" />
        )}
      </div>
      <Drawer
        title="Create new task"
        size="large"
        placement="right"
        destroyOnClose
        onClose={toggleDrawer(false)}
        open={openDrawer}>
        <TaskForm projectId={id} onDone={toggleDrawer(false)} task={selectedTask as Task | undefined} />
      </Drawer>
    </PageContainer>
  );
}
