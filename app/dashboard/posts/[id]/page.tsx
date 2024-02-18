"use client";

import WithPermission from "@app/_components/commons/hocs/WithPermission";
import { useGetPostQuery } from "@app/_configs/store/slices/apiSlice";
import Loader from "@components/commons/Loader";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const PostForm = dynamic(() => import("@components/PostModule/PostForm"), { ssr: false, loading: () => <Loader /> });

function Page({ params, setTitle, setGoBack }: any) {
  const { data: post, isLoading } = useGetPostQuery(params.id as string);

  useEffect(() => {
    if (setTitle) setTitle("Edit post");
    if (setGoBack) setGoBack(true);
  }, [setTitle, setGoBack]);

  return <div className="grow overflow-auto">{isLoading ? <Loader /> : <PostForm post={post} />}</div>;
}
export default WithPermission(Page, Permissions.EDIT_POST);
