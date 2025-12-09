import { UrlParams } from "@lib/interfaces/shared";
import Empty from "@resources/components/common/Empty";
import { ErrorBoundary } from "@resources/components/common/ErrorBoundary";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import ProjectCard from "@resources/components/features/Project/ProjectCard";
import ProjectsFilter from "@resources/components/features/Project/ProjectsFilter";
import { getProjects } from "@server/actions/projectActions";
import { Suspense } from "react";

export default async function Page({ searchParams }: { searchParams: Promise<UrlParams> }) {
  const { search = "" } = await searchParams;
  const projects = await getProjects({ search });

  const RenderProjects = () => {
    if (!projects.length) return <Empty />;

    return (
      <div className="flex flex-wrap gap-2">
        {projects.map((project: ObjectType) => (
          <ErrorBoundary key={project.id}>
            <Suspense fallback={<Loader />}>
              <ProjectCard {...project} />
            </Suspense>
          </ErrorBoundary>
        ))}
      </div>
    );
  };

  return (
    <PageContainer title="Projects">
      <ProjectsFilter searchPlaceholder="Find your project" createLabel="New Project" />
      <div className="grow overflow-auto pb-3">{RenderProjects()}</div>
    </PageContainer>
  );
}
