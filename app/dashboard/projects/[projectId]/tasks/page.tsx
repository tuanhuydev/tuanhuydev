"use client";

import { Task } from "@lib/types/task";
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

  const { filter, handleSearch, handleFilterChange } = useTaskFilter({
    onFilterChange: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"], exact: true });
    },
  });

  const { data: project } = useProjectQuery(projectId) as { data: Record<string, unknown> | undefined };
  const {
    data: tasks = [],
    refetch: refetchTasks,
    isLoading,
  } = useProjectTasks(projectId, filter as Record<string, unknown>) as {
    data: Task[];
    refetch: () => Promise<unknown>;
    isLoading: boolean;
  };

  useEffect(() => {
    const searchTimeout = setTimeout(() => void refetchTasks(), 500);
    return () => clearTimeout(searchTimeout);
  }, [filter, refetchTasks]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <TaskPage
          tasks={tasks as Record<string, unknown>[]}
          project={project as Record<string, unknown>}
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
