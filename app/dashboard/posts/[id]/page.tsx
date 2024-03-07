"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import { useGetPostQuery } from "@app/_configs/store/slices/apiSlice";
import Loader from "@components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const PostForm = dynamic(() => import("@components/PostModule/PostForm"), { ssr: false, loading: () => <Loader /> });

function Page({ params }: any) {
  const { data: post, isLoading } = useGetPostQuery(params.id as string);

  return (
    <PageContainer title="Edit Post" goBack>
      <div className="grow h-full">{isLoading ? <Loader /> : <PostForm post={post} />}</div>
    </PageContainer>
  );
}
export default Page;
