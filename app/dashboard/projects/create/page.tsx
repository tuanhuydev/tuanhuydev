import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { Suspense, lazy } from "react";

// Replace dynamic import with React lazy
const ProjectForm = lazy(() => import("@resources/components/features/Project/ProjectForm"));

export default async function Page() {
  return (
    <PageContainer title="Create new project" goBack>
      <Suspense fallback={<Loader />}>
        <ProjectForm />
      </Suspense>
    </PageContainer>
  );
}
