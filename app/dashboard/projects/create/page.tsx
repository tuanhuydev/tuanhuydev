"use client";

import ProjectForm from "@components/ProjectModule/ProjectForm";
import WithAuth from "@components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import React, { useEffect } from "react";

function Page({ setTitle, setPageKey, setGoBack }: any) {
  useEffect(() => {
    if (setTitle) setTitle("Create new project");
    if (setPageKey) setPageKey(Permissions.CREATE_PROJECT);
    if (setGoBack) setGoBack(true);
  }, [setTitle, setPageKey, setGoBack]);

  return <ProjectForm />;
}
export default WithAuth(Page);
