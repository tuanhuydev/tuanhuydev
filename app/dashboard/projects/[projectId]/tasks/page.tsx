"use client";

import { ErrorBoundary } from "@resources/components/common/ErrorBoundary";
import Loader from "@resources/components/common/Loader";
import { useTaskFilter } from "@resources/hooks/useTaskFilter";
import { useProjectQuery, useProjectTasks } from "@resources/queries/projectQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, lazy, use, useEffect } from "react";

const TaskPage = lazy(() => import("@resources/components/features/Task/TaskPage"));

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

  const { filter, searchValue, handleSearch, handleFilterChange } = useTaskFilter({
    onFilterChange: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"], exact: true });
    },
  });

  const { data: project } = useProjectQuery(projectId);
  const { data: tasks = [], refetch: refetchTasks, isLoading } = useProjectTasks(projectId, filter);

  useEffect(() => {
    const searchTimeout = setTimeout(refetchTasks, 500);
    return () => clearTimeout(searchTimeout);
  }, [filter, refetchTasks]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <TaskPage
          tasks={tasks}
          project={project}
          selectedTaskId={taskId}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          loading={isLoading}
          allowSubTasks
        />
      </Suspense>
    </ErrorBoundary>
  );
}
