"use client";

import WithAuth from "@app/_components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const Loader = dynamic(() => import("@components/commons/Loader"), { ssr: false });

const PostForm = dynamic(() => import("@components/PostModule/PostForm"), {
  ssr: false,
  loading: () => <Loader />,
});

function Page({ setTitle, setPageKey, setGoBack }: any) {
  useEffect(() => {
    if (setTitle) setTitle("Create new post");
    if (setPageKey) setPageKey(Permissions.CREATE_POST);
    if (setGoBack) setGoBack(true);
  }, [setTitle, setPageKey, setGoBack]);

  return <PostForm />;
}

export default WithAuth(Page);
