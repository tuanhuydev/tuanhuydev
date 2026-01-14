"use client";

import { Post } from "@features/Post/post";
import Loader from "@resources/components/common/Loader";
import { usePostQuery } from "@resources/queries/postQueries";
import { Suspense, lazy, use } from "react";

// Replace dynamic imports with React lazy
const PageContainer = lazy(() => import("@resources/components/features/Dashboard/PageContainer"));
const PostForm = lazy(() =>
  import("@resources/components/features/Post/PostForm").then((module) => ({
    default: module.PostForm,
  })),
);

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);
  const { id } = params;
  const { data: post, isFetching } = usePostQuery(id);

  return (
    <Suspense fallback={<Loader />}>
      <PageContainer title="Edit Post" goBack="/dashboard/posts">
        <div className="grow h-full">
          {isFetching ? (
            <Loader />
          ) : (
            <Suspense fallback={<Loader />}>
              <PostForm post={post as Post} />
            </Suspense>
          )}
        </div>
      </PageContainer>
    </Suspense>
  );
}
