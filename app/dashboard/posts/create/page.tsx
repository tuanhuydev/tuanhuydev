import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { Suspense, lazy } from "react";

// Replace dynamic import with React lazy - note we need to handle non-default export differently
const PostForm = lazy(() =>
  import("@resources/components/features/Post/PostForm").then((module) => ({
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
