import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ProjectForm = dynamic(() => import("@app/components/ProjectModule/ProjectForm"), {
  ssr: false,
  loading: () => <Loader />,
});

export default async function Page() {
  return (
    <PageContainer title="Create new project" goBack>
      <Suspense fallback={<Loader />}>
        <ProjectForm />
      </Suspense>
    </PageContainer>
  );
}
