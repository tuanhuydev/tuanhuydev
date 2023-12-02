"use client";

import { useGetPostQuery } from "@lib/store/slices/apiSlice";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });
const PostForm = dynamic(() => import("@lib/PostModule/PostForm"), { ssr: false, loading: () => <Loader /> });
const PageContainer = dynamic(() => import("@lib/DashboardModule/PageContainer").then((module) => module.default), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Page({ params }: any) {
  const { data: post, isLoading } = useGetPostQuery(params.id as string);
  useEffect(() => {
    console.log("Client side rendering");
  }, []);

  return (
    <PageContainer title="Edit post" goBack pageKey="Posts">
      <div className="grow overflow-auto">{isLoading ? <Loader /> : <PostForm post={post} />}</div>
    </PageContainer>
  );
}
