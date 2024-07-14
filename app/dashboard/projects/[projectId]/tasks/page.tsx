"use client";

import { useProjectQuery, useProjectTasks } from "@app/queries/projectQueries";
import TaskPage from "@components/TaskModule/TaskPage";
import { useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function Page({ params }: any) {
  const { projectId } = params;

  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [filter, setFilter] = useState<FilterType>({});

  const { data: project } = useProjectQuery(projectId);
  const { data: tasks = [], refetch: refetchTasks, isLoading } = useProjectTasks(projectId, filter);

  const handleFilterChange = (filter: FilterType) => {
    setFilter(filter);
  };

  const searchTasks: ChangeEventHandler<HTMLInputElement> = (event) => {
    const search = event.target.value;
    setFilter((filter) => {
      if (search?.length) return { ...filter, search };

      delete filter?.search;
      return filter;
    });
  };

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout;
    if (filter) searchTimeout = setTimeout(refetchTasks, 1000);
    return () => clearTimeout(searchTimeout);
  }, [filter, refetchTasks, tasks]);

  return (
    <TaskPage
      tasks={tasks}
      project={project}
      selectedTaskId={taskId}
      onSearch={searchTasks}
      onFilterChange={handleFilterChange}
      loading={isLoading}
    />
  );
}
