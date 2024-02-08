"use client";

import WithPermission from "@app/_components/commons/hocs/WithPermission";
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
export default WithPermission(Page, Permissions.CREATE_PROJECT);
