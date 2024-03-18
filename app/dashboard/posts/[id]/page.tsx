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
  const { data: post } = usePostQuery(Number.parseInt(params.id as unknown as string, 10));

  return (
    <PageContainer title="Edit Post" goBack>
      <div className="grow h-full">
        <PostForm post={post} />
      </div>
    </PageContainer>
  );
}
