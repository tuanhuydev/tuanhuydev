import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import dynamic from "next/dynamic";

const ProjectForm = dynamic(() => import("@app/components/ProjectModule/ProjectForm"), {
  ssr: false,
  loading: () => <Loader />,
});

async function Page() {
  return (
    <PageContainer title="Create new project" goBack>
      <ProjectForm />
    </PageContainer>
  );
}
export default Page;
