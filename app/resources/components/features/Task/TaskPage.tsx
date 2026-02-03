"use client";

import { Task } from "@lib/types/task";
import { User } from "@lib/types/user";
import { Drawer, DrawerContent, DrawerTitle } from "@resources/components/common/Drawer";
import Loader from "@resources/components/common/Loader";
import PageFilter from "@resources/components/common/PageFilter";
import { VisuallyHidden } from "@resources/components/common/VisuallyHidden";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { useUsersQuery } from "@resources/queries/userQueries";
import { logService } from "@server/services/LogService";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";

// Replace dynamic imports with React lazy
const TaskFormTitle = lazy(() => import("@resources/components/features/Task/TaskFormTitle"));
const TaskList = lazy(() => import("@resources/components/features/Task/TaskList"));
const TaskPreview = lazy(() => import("@resources/components/features/Task/TaskPreview"));
const TaskForm = lazy(() => import("@resources/components/features/Task/TaskForm"));

const COMPONENT_MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

interface TaskPageProps {
  project?: Record<string, unknown>;
  tasks?: Record<string, unknown>[];
  selectedTaskId?: string | null;
  allowSubTasks?: boolean;
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (filter: FilterType) => void;
  loading?: boolean;
}

function TaskPage({
  project = { name: "My Tasks", users: [] },
  tasks = [],
  selectedTaskId = null,
  onSearch,
  allowSubTasks = false,
  loading = false,
}: TaskPageProps) {
  // Hooks
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsersQuery();

  // States
  const [meta, setMeta] = useState({
    selectedTask: null as Task | null,
    openDrawer: false,
    mode: COMPONENT_MODE.VIEW,
  });

  // Constants
  const { selectedTask, openDrawer, mode } = meta;
  const isEditMode = mode === COMPONENT_MODE.EDIT;

  const allowCreateTask = true;

  const projectUsers = useMemo(() => {
    const { users: projectUserIds = [] } = project;
    if (!(projectUserIds as Array<string>).length) return [];

    return users
      .filter(({ id }: User) => (projectUserIds as Array<string>).includes(id))
      .map(({ id, name }: User) => ({ label: name, value: id }));
  }, [project, users]);

  const createNewTask = useCallback(() => {
    setMeta((prevState) => ({
      ...prevState,
      selectedTask: null,
      mode: COMPONENT_MODE.EDIT,
      openDrawer: true,
    }));
  }, []);

  const toggleDrawer = useCallback(
    (value: boolean) => () => {
      setMeta((prevState) => ({
        ...prevState,
        selectedTask: value ? prevState.selectedTask : null,
        openDrawer: value,
      }));
    },
    [],
  );

  const toggleMode = useCallback((value: string) => {
    setMeta((prevState) => ({ ...prevState, mode: value }));
  }, []);

  const mutateTaskError = useCallback((error: Error) => {
    logService.log(error.message);
  }, []);

  const mutateTaskSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setMeta((prevState) => ({ ...prevState, openDrawer: false }));
  }, [queryClient]);

  const RenderTaskDetails = useMemo(() => {
    if (isEditMode) {
      return (
        <TaskForm
          projectId={project?.id as number}
          onDone={() => void mutateTaskSuccess()}
          onError={mutateTaskError}
          task={selectedTask as Task | undefined}
        />
      );
    }
    const projectUser = projectUsers.find(
      ({ value: userId }: SelectOption<string>) => userId === selectedTask?.assigneeId,
    );
    return <TaskPreview task={selectedTask} assignee={projectUser} />;
  }, [isEditMode, projectUsers, selectedTask, project?.id, mutateTaskSuccess, mutateTaskError]);

  const onSelectTask = useCallback((task: Task) => {
    setMeta((prevState) => ({
      ...prevState,
      selectedTask: task,
      mode: COMPONENT_MODE.VIEW,
      openDrawer: true,
    }));
  }, []);

  useEffect(() => {
    if (tasks.length && selectedTaskId) {
      const task = tasks.find((task: Record<string, unknown>) => String(task.id) === selectedTaskId);
      if (task) {
        onSelectTask(task as Task);
      }
    }
  }, [onSelectTask, selectedTaskId, tasks]);

  return (
    <Suspense fallback={<Loader />}>
      <PageContainer title={(project.name as string) ?? ""} goBack={!!project.name}>
        <div className="flex flex-col gap-4 h-full">
          <PageFilter onSearch={onSearch} onNew={createNewTask} createLabel="New Task" allowCreate={allowCreateTask} />
          <div className="flex-1 overflow-auto">
            <TaskList
              projectId={project?.id as string}
              tasks={tasks as Array<Task>}
              selectedTask={selectedTask}
              onSelectTask={onSelectTask}
              isLoading={loading}
            />
          </div>
        </div>
        <Drawer open={openDrawer} onOpenChange={(isOpen) => !isOpen && toggleDrawer(false)()}>
          <DrawerContent
            side="right"
            className="w-full sm:w-[90vw] md:w-[600px] lg:w-[700px] xl:w-[800px] h-full sm:h-[calc(100vh-1rem)] sm:m-2 sm:mr-2 sm:rounded-lg">
            <VisuallyHidden>
              <DrawerTitle>{selectedTask?.title || "Task Details"}</DrawerTitle>
            </VisuallyHidden>
            <div className="flex flex-col h-full bg-background overflow-hidden sm:rounded-lg">
              <TaskFormTitle
                task={selectedTask as unknown as Partial<Task>}
                allowSubTask={!!selectedTask && allowSubTasks}
                mode={mode as "VIEW" | "EDIT"}
                allowEditTask={!!selectedTask}
                onClose={toggleDrawer(false)}
                onToggle={toggleMode}
              />
              <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6">{RenderTaskDetails}</div>
            </div>
          </DrawerContent>
        </Drawer>
      </PageContainer>
    </Suspense>
  );
}

export default TaskPage;
