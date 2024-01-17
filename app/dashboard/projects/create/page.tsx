"use client";

import ProjectForm from "@components/ProjectModule/ProjectForm";
import WithAuth from "@components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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
