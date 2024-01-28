"use client";

import WithAuth from "@components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import React, { useEffect } from "react";

function Page({ setTitle, setGoBack }: any) {
  useEffect(() => {
    setTitle("Tasks");
    setGoBack(false);
  }, [setGoBack, setTitle]);
  return <div>page</div>;
}

export default WithAuth(Page, Permissions.VIEW_TASKS);
