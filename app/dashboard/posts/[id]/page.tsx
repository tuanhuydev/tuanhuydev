"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import { usePostQuery } from "@app/queries/postQueries";
import dynamic from "next/dynamic";

const PostForm = dynamic(() => import("@app/components/PostModule/PostForm"), {
  ssr: false,
  loading: () => <Loader />,
});

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
