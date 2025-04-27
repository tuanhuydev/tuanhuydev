import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import { Suspense, lazy } from "react";

// Replace dynamic import with React lazy
const ProjectForm = lazy(() => import("@app/components/ProjectModule/ProjectForm"));

export default async function Page() {
  return (
    <PageContainer title="Create new project" goBack>
      <Suspense fallback={<Loader />}>
        <ProjectForm />
      </Suspense>
    </PageContainer>
  );
}
