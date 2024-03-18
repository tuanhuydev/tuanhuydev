import PageContainer from "@app/_components/DashboardModule/PageContainer";
import Loader from "@app/_components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const ProjectForm = dynamic(() => import("@components/ProjectModule/ProjectForm"), {
  ssr: false,
  loading: () => <Loader />,
});

async function Page() {
  return (
    <PageContainer title="Create new project" goBack>
      <ProjectForm />;
    </PageContainer>
  );
}
export default Page;
