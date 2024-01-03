"use client";

import WithAuth from "@lib/components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { useGetPostQuery } from "@lib/store/slices/apiSlice";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });
const PostForm = dynamic(() => import("@lib/PostModule/PostForm"), { ssr: false, loading: () => <Loader /> });

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
