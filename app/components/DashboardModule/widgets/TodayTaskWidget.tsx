"use client";

import Card from "@app/components/commons/Card";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import { InvalidateQueryFilters, QueryKey, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SyntheticEvent } from "react";

const Empty = dynamic(() => import("antd/es/empty"), { ssr: false });

export default function TodayTaskWidget() {
  const queryClient = useQueryClient();

  const todayTasks: Array<ObjectType> = queryClient.getQueryData(["todayTasks"]) || [];

  const completeTask = (task: ObjectType) => (event: SyntheticEvent<any, Event>) => {
    event.stopPropagation();
    queryClient.setQueryData(
      ["todayTasks"] as QueryKey,
      todayTasks.filter((todayTask: ObjectType) => todayTask.id !== task.id),
    );
    queryClient.invalidateQueries(["todayTasks"] as InvalidateQueryFilters);
  };
  return (
    <Card title="Today Tasks" className="w-[20rem] min-h-[8rem] overflow-hidden" icon={<TaskAltOutlined />}>
      {todayTasks?.length ? (
        <ul className="list-none m-0 p-0 h-72 overflow-auto">
          {todayTasks.map((task: ObjectType) => (
            <Link href={`/dashboard/tasks?taskId=${task?.id}`} key={task.id}>
              <li className=" text-primary dark:text-slate-50 hover:bg-slate-200 dark:hover:text-slate-400 flex items-center p-2">
                <input type="checkbox" className="mr-2 text-lg w-4 h-4 flex-shrink-0" onClick={completeTask(task)} />
                <span className="text-base capitalize truncate">{task?.title}</span>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </Card>
  );
}
