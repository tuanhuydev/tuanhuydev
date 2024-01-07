"use client";

import WithAuth from "@app/_components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { useGetPostQuery } from "@store/slices/apiSlice";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const Loader = dynamic(() => import("@components/commons/Loader"), { ssr: false });
const PostForm = dynamic(() => import("@components/PostModule/PostForm"), { ssr: false, loading: () => <Loader /> });

function Page({ params, setTitle, setPageKey, setGoBack }: any) {
  const { data: post, isLoading } = useGetPostQuery(params.id as string);

  useEffect(() => {
    if (setTitle) setTitle("Edit post");
    if (setPageKey) setPageKey(Permissions.EDIT_POST);
    if (setGoBack) setGoBack(true);
  }, [setTitle, setPageKey, setGoBack]);

  return <div className="grow overflow-auto">{isLoading ? <Loader /> : <PostForm post={post} />}</div>;
}
export default WithAuth(Page);
