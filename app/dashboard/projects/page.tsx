"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import Loader from "@app/_components/commons/Loader";
import PageFilter from "@app/_components/commons/PageFilter";
import { useProjectsQuery } from "@app/queries/projectQueries";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

const Empty = dynamic(async () => (await import("antd/es/empty")).default, { ssr: false, loading: () => <Loader /> });

const ProjectCard = dynamic(async () => (await import("@components/ProjectModule/ProjectCard")).default, {
  loading: () => <Loader />,
});

function Page() {
  const router = useRouter();

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
          <ProjectCard {...project} key={project.id} />
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
      />
      <div className="grow overflow-auto pb-3">{RenderProjects}</div>
    </PageContainer>
  );
}

export default Page;
