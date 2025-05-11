"use client";

import { usePostQuery } from "@app/_queries/postQueries";
import Loader from "@app/components/commons/Loader";
import { Suspense, lazy, use } from "react";

// Replace dynamic imports with React lazy
const PageContainer = lazy(() => import("@app/components/DashboardModule/PageContainer"));
const PostForm = lazy(() =>
  import("@app/components/PostModule/PostForm").then((module) => ({
    default: module.PostForm,
  })),
);

interface PageProps {
  params: Promise<any>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);
  const { id } = params;
  const { data: post, isFetching } = usePostQuery(id as string);

  return (
    <Suspense fallback={<Loader />}>
      <PageContainer title="Edit Post" goBack>
        <div className="grow h-full">
          {isFetching ? (
            <Loader />
          ) : (
            <Suspense fallback={<Loader />}>
              <PostForm post={post} />
            </Suspense>
          )}
        </div>
      </PageContainer>
    </Suspense>
  );
}
