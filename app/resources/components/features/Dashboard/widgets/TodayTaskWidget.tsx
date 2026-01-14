"use client";

import { Card, CardHeader, CardTitle, CardContent, Empty } from "@app/resources/components/common";
import { Task } from "@lib/types/task";
import { QUERY_KEYS } from "@resources/queries/queryKeys";
import { useTodayTasks } from "@resources/queries/taskQueries";
import { InvalidateQueryFilters, QueryKey, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Link } from "lucide-react";
import { SyntheticEvent } from "react";

export default function TodayTaskWidget() {
  const queryClient = useQueryClient();
  const { data: todayTasks = [] } = useTodayTasks();

  const completeTask = (task: Task) => (event: SyntheticEvent<unknown, Event>) => {
    event.stopPropagation();
    queryClient.setQueryData(
      [QUERY_KEYS.TODAY_TASKS] as QueryKey,
      todayTasks.filter((todayTask: Task) => todayTask.id !== task.id),
    );
    void queryClient.invalidateQueries([QUERY_KEYS.TODAY_TASKS] as InvalidateQueryFilters);
  };

  return (
    <Card className="w-[20rem] min-h-[8rem] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today Tasks</CardTitle>
        <CheckCircle className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {todayTasks?.length ? (
          <ul className="list-none m-0 p-0 h-72 overflow-auto">
            {todayTasks.map((task: Task) => (
              <Link href={`/dashboard/apps/personal-tasks?taskId=${task.id}`} key={task.id}>
                <li className=" text-primary dark:text-slate-50 hover:bg-slate-200 dark:hover:text-slate-400 flex items-center p-2">
                  <input type="checkbox" className="mr-2 text-lg w-4 h-4 flex-shrink-0" onClick={completeTask(task)} />
                  <span className="text-base capitalize truncate">{task?.title}</span>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <Empty description="Yay no tasks for today :D" />
        )}
      </CardContent>
    </Card>
  );
}
