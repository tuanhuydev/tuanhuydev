"use client";

import Loader from "@app/components/commons/Loader";
import { usePostQuery } from "@app/queries/postQueries";
import dynamic from "next/dynamic";

const PageContainer = dynamic(() => import("@app/components/DashboardModule/PageContainer"), {
  ssr: false,
  loading: () => <Loader />,
});

const PostForm = dynamic(async () => (await import("@app/components/PostModule/PostFormV2")).PostFormV2, {
  ssr: false,
  loading: () => <Loader />,
});

interface PageProps {
  params: any;
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  const { data: post, isFetching } = usePostQuery(id as string);

  return (
    <PageContainer title="Edit Post" goBack>
      <div className="grow h-full">{isFetching ? <Loader /> : <PostForm post={post} />}</div>
    </PageContainer>
  );
}
