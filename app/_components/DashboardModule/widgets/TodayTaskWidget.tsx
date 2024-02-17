"use client";

import Card from "@app/_components/commons/Card";
import { getLocalStorage, setLocalStorage } from "@lib/shared/utils/dom";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import Empty from "antd/es/empty";
import Link from "next/link";
import React, { SyntheticEvent, useEffect } from "react";

export default function TodayTaskWidget() {
  const [todayTasks, setTodayTasks] = React.useState(getLocalStorage("todayTasks") || []);
  console.log(todayTasks);

  const completeTask = (task: ObjectType) => (event: SyntheticEvent<any, Event>) => {
    event.stopPropagation();
    setTodayTasks((prevTasks: ObjectType[]) => prevTasks.filter((prevTask: ObjectType) => prevTask.id !== task.id));
  };
  useEffect(() => {
    return () => {
      setLocalStorage("todayTasks", JSON.stringify(todayTasks));
    };
  }, [todayTasks]);

  return (
    <Card title="Today Tasks" className="w-[20rem] min-h-[8rem] overflow-hidden" icon={<TaskAltOutlined />}>
      {todayTasks?.length ? (
        <ul className="list-none m-0 p-0 h-72 overflow-auto">
          {todayTasks.map((task: ObjectType) => (
            <Link href={`/dashboard/tasks?taskId=${task?.id}`} key={task.id}>
              <li className=" text-primary hover:bg-slate-200 flex items-center p-2">
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
