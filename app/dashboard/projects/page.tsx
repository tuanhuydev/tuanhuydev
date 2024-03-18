"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import BaseInput from "@app/_components/commons/Inputs/BaseInput";
import Loader from "@app/_components/commons/Loader";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import { useProjectsQuery } from "@app/queries/projectQueries";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Project } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useCallback, useState } from "react";

const Empty = dynamic(async () => (await import("antd/es/empty")).default, { ssr: false, loading: () => <Loader /> });

const ProjectCard = dynamic(async () => (await import("@components/ProjectModule/ProjectCard")).default, {
  ssr: false,
  loading: () => <Loader />,
});

function Page() {
  const router = useRouter();

  const [filter, setFilter] = useState<ObjectType>({});
  const { data: projects = [], isLoading } = useProjectsQuery(filter);

  const onSearchProjects = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const search = event.target.value;
      setFilter((filter) => ({ ...filter, search }));
    }, 500);
  }, []);

  const createNewProject = useCallback(() => {
    router.push("/dashboard/projects/create");
  }, [router]);

  return (
    <PageContainer title="Projects">
      <div className="flex gap-2 items-center mb-6" data-testid="dashboard-posts-page-testid">
        <BaseInput
          onChange={onSearchProjects}
          placeholder="Find your project"
          className="grow mr-2 rounded-sm"
          startAdornment={<SearchOutlined fontSize="small" />}
        />
        <BaseButton
          label="New Project"
          icon={<ControlPointOutlined fontSize="small" />}
          onClick={createNewProject}></BaseButton>
      </div>
      <div className="grow overflow-auto pb-3">
        {isLoading ? (
          <Loader />
        ) : projects.length ? (
          <div className="flex flex-wrap gap-2">
            {projects.map((project: Project) => (
              <ProjectCard {...project} key={project.id} />
            ))}
          </div>
        ) : (
          <Empty className="my-36" />
        )}
      </div>
    </PageContainer>
  );
}

export default Page;
