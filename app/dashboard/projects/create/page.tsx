"use client";

import WithAuth from "@components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectForm = dynamic(() => import("@components/ProjectModule/ProjectForm"), { ssr: false });

function Page({ setTitle, setGoBack }: any) {
  const router = useRouter();

  useEffect(() => {
    if (setTitle) setTitle("Create new project");
    if (setGoBack) setGoBack(true);
  }, [setTitle, setGoBack]);

  const navigateBack = () => {
    router.back();
  };
  return <ProjectForm callback={navigateBack} />;
}
export default WithAuth(Page, Permissions.CREATE_PROJECT);
