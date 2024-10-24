"use client";

import Loader from "@app/components/commons/Loader";
import { useCurrentUserTasks } from "@app/queries/userQueries";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

const TaskPage = dynamic(() => import("@app/components/TaskModule/TaskPage"), {
  ssr: false,
  loading: () => <Loader />,
});

interface FilterMyTasksType extends FilterType {
  projectId: string | null;
}

export default function Page() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId") ?? null;

  const [filter, setFilter] = useState<FilterMyTasksType>({
    projectId: null,
  });

  const { data: tasks = [], refetch: refetchTasks, isLoading: isTasksLoading } = useCurrentUserTasks(filter);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...filter }));
  }, []);

  const searchTasks: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const search = event.target.value;
    setFilter((filter) => {
      if (search?.length) return { ...filter, search };

      delete filter?.search;
      return filter;
    });
  }, []);

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout;
    if (filter) searchTimeout = setTimeout(refetchTasks, 1000);
    return () => clearTimeout(searchTimeout);
  }, [filter, refetchTasks, tasks]);

  return (
    <TaskPage
      tasks={tasks}
      selectedTaskId={taskId}
      onSearch={searchTasks}
      onFilterChange={handleFilterChange}
      loading={isTasksLoading}
      allowSubTasks={false}
    />
  );
}
