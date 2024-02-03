"use client";

import WithAuth from "@app/_components/commons/hocs/WithAuth";
import Loader from "@components/commons/Loader";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { useGetPostQuery } from "@store/slices/apiSlice";
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
export default WithAuth(Page, Permissions.EDIT_POST);
