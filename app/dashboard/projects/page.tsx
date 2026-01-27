/**
 * @deprecated This page component is deprecated and may be removed or refactored in future releases.
 *
 * Dashboard Projects Page.
 *
 * Fetches and displays a list of projects, with filtering and empty state handling.
 * Utilizes server-side data fetching for projects based on search parameters.
 *
 * @param searchParams - A promise resolving to URL parameters for filtering projects.
 * @returns The projects dashboard page with filter, project cards, and empty state.
 */
import { UrlParams } from "@lib/interfaces/shared";
import { Project } from "@lib/types/project";
import Empty from "@resources/components/common/Empty";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import ProjectCard from "@resources/components/features/Project/ProjectCard";
import ProjectsFilter from "@resources/components/features/Project/ProjectsFilter";
import { getProjects } from "@server/actions/projectActions";

export default async function Page({ searchParams }: { searchParams: Promise<UrlParams> }) {
  const { search = "" } = await searchParams;
  const projects = await getProjects({ search });
  console.log(projects);

  const RenderProjects = () => {
    if (!projects.length) return <Empty />;

    return (
      <div className="flex flex-wrap gap-2">
        {projects.map((project: Project) => (
          <ProjectCard {...project} users={[]} key={project.id} />
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
