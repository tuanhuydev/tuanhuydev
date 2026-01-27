"use client";

import { PostFormV2 } from "@app/resources/components/features/Post/PostFormV2";
import { Post } from "@app/resources/types/post.types";
import Loader from "@resources/components/common/Loader";
import { usePostQuery } from "@resources/queries/postQueries";
import { Suspense, lazy, use } from "react";

// Replace dynamic imports with React lazy
const PageContainer = lazy(() => import("@resources/components/features/Dashboard/PageContainer"));

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
              <PostFormV2 post={post as Post} />
            </Suspense>
          )}
        </div>
      </PageContainer>
    </Suspense>
  );
}
