import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import { redirect } from "next/navigation";
import { Suspense, lazy } from "react";
import { getProjectByIdAction } from "server/actions/projectActions";

// Replace dynamic import with React lazy
const ProjectForm = lazy(() => import("@app/components/ProjectModule/ProjectForm"));

export default async function Page(props: any) {
  const params = await props.params;
  const projectId: string | undefined = params?.projectId;
  if (!projectId) {
    return redirect("/dashboard/projects");
  }

  const project: Project = await getProjectByIdAction(projectId);
  return (
    <PageContainer title="Edit Project" goBack>
      <Suspense fallback={<Loader />}>
        <ProjectForm project={project as unknown as Project} />
      </Suspense>
    </PageContainer>
  );
}
