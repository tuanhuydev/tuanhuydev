"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectForm = dynamic(() => import("@components/ProjectModule/ProjectForm"), { ssr: false });

function Page({ setTitle, setGoBack }: any) {
  const router = useRouter();

  const navigateBack = () => {
    router.back();
  };
  return (
    <PageContainer title="Create new project" goBack>
      <ProjectForm callback={navigateBack} />;
    </PageContainer>
  );
}
export default Page;
