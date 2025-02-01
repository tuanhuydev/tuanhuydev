import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import { Project } from "lib/types/models";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getProjectByIdAction } from "server/actions/projectActions";

const ProjectForm = dynamic(() => import("@app/components/ProjectModule/ProjectForm"), {
  ssr: false,
  loading: () => <Loader />,
});

export default async function Page({ params }: any) {
  const projectId: string | undefined = params?.projectId;
  if (!projectId) {
    return redirect("/dashboard/projects");
  }

  const project: Project = await getProjectByIdAction(projectId);
  return (
    <PageContainer title="Edit Project" goBack>
      <ProjectForm project={project as unknown as Project} />
    </PageContainer>
  );
}
