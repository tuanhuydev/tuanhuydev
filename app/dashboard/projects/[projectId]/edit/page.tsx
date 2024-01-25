"use client";

import Loader from "@app/_components/commons/Loader";
import WithAuth from "@app/_components/hocs/WithAuth";
import { useGetProjectQuery } from "@app/_store/slices/apiSlice";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectForm = dynamic(async () => (await import("@app/_components/ProjectModule/ProjectForm")).default, {
  ssr: false,
});

function Page({ params, setTitle, setGoBack }: any) {
  const router = useRouter();
  const { data, isLoading } = useGetProjectQuery(params.projectId as string);

  useEffect(() => {
    if (setTitle) setTitle("Edit Project");
    if (setGoBack) setGoBack(true);
  }, [setTitle, setGoBack]);

  const navigateBack = () => router.back();

  if (isLoading) return <Loader />;

  return <ProjectForm project={data} callback={navigateBack} />;
}

export default WithAuth(Page, Permissions.EDIT_PROJECT);
