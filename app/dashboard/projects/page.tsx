import PageContainer from "@app/components/DashboardModule/PageContainer";
import ProjectCard from "@app/components/ProjectModule/ProjectCard";
import ProjectsFilter from "@app/components/ProjectModule/ProjectsFilter";
import Empty from "@app/components/commons/Empty";
import { ErrorBoundary } from "@app/components/commons/ErrorBoundary";
import Loader from "@app/components/commons/Loader";
import { UrlParams } from "@lib/interfaces/shared";
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
