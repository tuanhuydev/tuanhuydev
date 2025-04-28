"use client";

import { useCurrentUserPermission } from "@app/_queries/permissionQueries";
import { useProjectsQuery } from "@app/_queries/projectQueries";
import PageContainer from "@app/components/DashboardModule/PageContainer";
import Empty from "@app/components/commons/Empty";
import Loader from "@app/components/commons/Loader";
import PageFilter from "@app/components/commons/PageFilter";
import { useRouter } from "next/navigation";
import { ChangeEvent, Suspense, lazy, useCallback, useMemo, useState } from "react";

// Replace dynamic import with React lazy
const ProjectCard = lazy(() => import("@app/components/ProjectModule/ProjectCard"));

function Page() {
  const router = useRouter();
  const { data: permissions = [] } = useCurrentUserPermission();

  const allowCreateProject = (permissions as Array<ObjectType>).some((permission: ObjectType = {}) => {
    const { action = "", resourceId = "", type = "" } = permission;
    return action === "create" && type === "project" && resourceId === "*";
  });

  const [filter, setFilter] = useState<ObjectType>({});
  const { data: projects = [], isLoading, refetch } = useProjectsQuery(filter);

  const onSearchProjects = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTimeout(() => {
        const search = event.target.value;
        setFilter((prevFilter) => {
          if (search?.length) return { ...prevFilter, search };
          delete prevFilter?.search;
          return prevFilter;
        });
        refetch();
      }, 500);
    },
    [refetch],
  );

  const RenderProjects = useMemo(() => {
    if (isLoading) return <Loader />;

    if (!projects.length) return <Empty />;

    return (
      <div className="flex flex-wrap gap-2">
        {projects.map((project: ObjectType) => (
          <Suspense fallback={<Loader />} key={project.id}>
            <ProjectCard {...project} />
          </Suspense>
        ))}
      </div>
    );
  }, [isLoading, projects]);

  const createNewProject = useCallback(() => {
    router.push("/dashboard/projects/create");
  }, [router]);

  return (
    <PageContainer title="Projects">
      <PageFilter
        onSearch={onSearchProjects}
        onNew={createNewProject}
        searchPlaceholder="Find your project"
        createLabel="New Project"
        allowCreate={allowCreateProject}
      />
      <div className="grow overflow-auto pb-3">{RenderProjects}</div>
    </PageContainer>
  );
}

export default Page;
