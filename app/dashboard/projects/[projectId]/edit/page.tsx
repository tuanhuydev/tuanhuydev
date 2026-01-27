import { Project } from "@lib/types/project";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { redirect } from "next/navigation";
import { Suspense, lazy } from "react";
import { getProjectByIdAction } from "server/actions/projectActions";

// Replace dynamic import with React lazy
const ProjectForm = lazy(() => import("@resources/components/features/Project/ProjectForm"));

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}
export default async function Page(props: PageProps) {
  const params = await props.params;
  const projectId: string | undefined = params?.projectId;
  if (!projectId) {
    return redirect("/dashboard/projects");
  }

  const project = await getProjectByIdAction(projectId);
  return (
    <PageContainer title="Edit Project" goBack>
      <Suspense fallback={<Loader />}>
        <ProjectForm project={project as unknown as Project} />
      </Suspense>
    </PageContainer>
  );
}
