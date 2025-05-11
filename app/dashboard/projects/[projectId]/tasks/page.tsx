"use client";

import { useProjectQuery, useProjectTasks } from "@app/_queries/projectQueries";
import Loader from "@app/components/commons/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ChangeEventHandler, Suspense, lazy, use, useEffect, useState } from "react";

const TaskPage = lazy(() => import("@app/components/TaskModule/TaskPage"));

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}
export default function Page({ params }: PageProps) {
  const { projectId } = use(params);
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
    <Suspense fallback={<Loader />}>
      <TaskPage
        tasks={tasks}
        project={project}
        selectedTaskId={taskId}
        onSearch={searchTasks}
        onFilterChange={handleFilterChange}
        loading={isLoading}
        allowSubTasks
      />
    </Suspense>
  );
}
