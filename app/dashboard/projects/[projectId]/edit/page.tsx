"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import Loader from "@app/_components/commons/Loader";
import { useGetProjectQuery } from "@app/_configs/store/slices/apiSlice";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

const ProjectForm = dynamic(async () => (await import("@app/_components/ProjectModule/ProjectForm")).default, {
  ssr: false,
});

function Page({ params }: any) {
  const router = useRouter();
  const { data, isLoading } = useGetProjectQuery(params.projectId as string);

  const navigateBack = () => router.back();

  if (isLoading) return <Loader />;

  return (
    <PageContainer title="Edit Project" goBack>
      <ProjectForm project={data} callback={navigateBack} />
    </PageContainer>
  );
}

export default Page;
