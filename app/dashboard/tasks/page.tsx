"use client";

import { useTaskFilter } from "@app/_hooks/useTaskFilter";
import { useCurrentUserTasks } from "@app/_queries/userQueries";
import { ErrorBoundary } from "@app/components/commons/ErrorBoundary";
import Loader from "@app/components/commons/Loader";
import { useSearchParams } from "next/navigation";
import { Suspense, lazy, useEffect } from "react";

// Replace dynamic import with React lazy
const TaskPage = lazy(() => import("@app/components/TaskModule/TaskPage"));

interface FilterMyTasksType extends FilterType {
  projectId: string | null;
}

export default function Page() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId") ?? null;

  const { filter, searchValue, handleSearch, handleFilterChange, setFilter } = useTaskFilter<FilterMyTasksType>({
    initialFilter: { projectId: null } as FilterMyTasksType,
  });

  const { data: tasks = [], refetch: refetchTasks, isLoading: isTasksLoading } = useCurrentUserTasks(filter);

  useEffect(() => {
    const searchTimeout = setTimeout(refetchTasks, 500);
    return () => clearTimeout(searchTimeout);
  }, [filter, refetchTasks]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <TaskPage
          tasks={tasks}
          selectedTaskId={taskId}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          loading={isTasksLoading}
          allowSubTasks={false}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
