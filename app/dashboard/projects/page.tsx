"use client";

import WithAuth from "@app/_components/commons/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { useGetProjectsQuery } from "@store/slices/apiSlice";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useState } from "react";

const Loader = dynamic(async () => (await import("@components/commons/Loader")).default, { ssr: false });

const Empty = dynamic(async () => (await import("antd/es/empty")).default, { ssr: false, loading: () => <Loader /> });

const Input = dynamic(async () => (await import("antd/es/input")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Button = dynamic(async () => (await import("antd/es/button")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const ProjectCard = dynamic(async () => (await import("@components/ProjectModule/ProjectCard")).default, {
  ssr: false,
  loading: () => <Loader />,
});

function Page({ setTitle }: any) {
  const [filter, setFilter] = useState<ObjectType>({});
  const router = useRouter();
  const { data: projects = [], isLoading } = useGetProjectsQuery(filter);

  const onSearchProjects = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const search = event.target.value;
      setFilter((filter) => ({ ...filter, search }));
    }, 500);
  }, []);

  const createNewProject = useCallback(() => {
    router.push("/dashboard/projects/create");
  }, [router]);

  const renderProjects: JSX.Element = useMemo(
    () => (
      <div className="flex flex-wrap gap-2">
        {projects.map((project: any) => (
          <ProjectCard {...project} key={project.id} />
        ))}
      </div>
    ),
    [projects],
  );

  useEffect(() => {
    if (setTitle) setTitle("Projects");
  }, [setTitle]);

  return (
    <Fragment>
      <div className="flex items-center mb-6" data-testid="dashboard-posts-page-testid">
        <Input
          size="large"
          onChange={onSearchProjects}
          placeholder="Find your project"
          className="grow mr-2 rounded-sm"
          prefix={<SearchOutlined className="!text-lg " />}
        />
        <Button
          size="large"
          type="primary"
          icon={<ControlPointOutlined className="!h-[0.875rem] !w-[0.875rem] !leading-none" />}
          onClick={createNewProject}>
          New Project
        </Button>
      </div>
      <div className="grow overflow-auto pb-3">
        {isLoading ? <Loader /> : projects.length ? renderProjects : <Empty className="my-36" />}
      </div>
    </Fragment>
  );
}

export default WithAuth(Page, Permissions.VIEW_PROJECTS);
