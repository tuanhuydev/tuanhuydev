"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import { usePostQuery } from "@app/queries/postQueries";
import Loader from "@components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const PostForm = dynamic(() => import("@components/PostModule/PostForm"), { ssr: false, loading: () => <Loader /> });

interface PageProps {
  params: any;
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  const { data: post, isPending } = usePostQuery(id as string);

  return (
    <PageContainer title="Edit Post" goBack>
      <div className="grow h-full">{isPending ? <Loader /> : <PostForm post={post} />}</div>
    </PageContainer>
  );
}
