"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import { useProjectQuery } from "@app/queries/projectQueries";
import dynamic from "next/dynamic";

const ProjectForm = dynamic(async () => (await import("@app/components/ProjectModule/ProjectForm")).default, {
  ssr: false,
});

function Page({ params }: any) {
  const { data: project, isLoading } = useProjectQuery(params.projectId);

  if (isLoading) return <Loader />;

  return (
    <PageContainer title="Edit Project" goBack>
      <ProjectForm project={project} />;
    </PageContainer>
  );
}

export default Page;
