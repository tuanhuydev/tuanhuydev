import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import { Suspense, lazy } from "react";

// Replace dynamic import with React lazy - note we need to handle non-default export differently
const PostForm = lazy(() =>
  import("@app/components/PostModule/PostForm").then((module) => ({
    default: module.PostForm,
  })),
);

export default async function Page() {
  return (
    <PageContainer title="Create New Post" goBack>
      <Suspense fallback={<Loader />}>
        <PostForm />
      </Suspense>
    </PageContainer>
  );
}
