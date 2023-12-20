import Loader from "@lib/components/commons/Loader";
import { Task } from "@prisma/client";
import { Button } from "antd";
import dynamic from "next/dynamic";
import React from "react";

const EyeOutlined = dynamic(async () => (await import("@ant-design/icons")).EyeOutlined, {
  ssr: false,
  loading: () => <Loader />,
});

export interface TaskRowProps {
  onView: (task: Task) => void;
  task: Task;
  active: boolean;
  projectId: number;
}

export default function TaskRow({ task, onView, active = false }: TaskRowProps) {
  const { id, title } = task;

  const handleView = () => {
    if (onView) onView(task);
  };

  const activeClass = active ? "bg-slate-100" : "";

  return (
    <div
      className={`flex w-full items-center justify-between p-2 mb-2 cursor-pointer transition-all duration-300 rounded-md ${activeClass} hover:bg-slate-100`}>
      <h3 className="capitalize grow text-base font-normal m-0">
        [#{id}] {title}
      </h3>
      <div>
        <Button
          className="!bg-transparent !border-none !outline-none !text-inherit"
          icon={<EyeOutlined />}
          onClick={handleView}
        />
      </div>
    </div>
  );
}
