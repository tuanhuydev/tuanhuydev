"use client";

import Loader from "@app/components/commons/Loader";
import { useProjectQuery, useProjectTasks } from "@app/queries/projectQueries";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";

const TaskPage = dynamic(() => import("@app/components/TaskModule/TaskPage"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Page({ params }: any) {
  const { projectId } = params;
  const queryClient = useQueryClient();

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
    queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"], exact: true });
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
  }, [filter, refetchTasks]);

  return (
    <TaskPage
      tasks={tasks}
      project={project}
      selectedTaskId={taskId}
      onSearch={searchTasks}
      onFilterChange={handleFilterChange}
      loading={isLoading}
      allowSubTasks
    />
  );
}
