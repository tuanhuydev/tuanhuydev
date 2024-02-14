"use client";

import Loader from "@app/_components/commons/Loader";
import WithPermission from "@app/_components/commons/hocs/WithPermission";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const PostForm = dynamic(() => import("@components/PostModule/PostForm"), {
  ssr: false,
  loading: () => <Loader />,
});

function Page({ setTitle, setGoBack }: any) {
  useEffect(() => {
    if (setTitle) setTitle("Create new post");
    if (setGoBack) setGoBack(true);
  }, [setTitle, setGoBack]);

  return <PostForm />;
}

export default WithPermission(Page, Permissions.CREATE_POST);
