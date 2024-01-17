"use client";

import WithAuth from "@components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectForm = dynamic(() => import("@components/ProjectModule/ProjectForm"), { ssr: false });

function Page({ setTitle, setPageKey, setGoBack }: any) {
  const router = useRouter();

  useEffect(() => {
    if (setTitle) setTitle("Create new project");
    if (setPageKey) setPageKey(Permissions.CREATE_PROJECT);
    if (setGoBack) setGoBack(true);
  }, [setTitle, setPageKey, setGoBack]);

  const navigateBack = () => {
    router.back();
  };
  return <ProjectForm callback={navigateBack} />;
}
export default WithAuth(Page);
