"use client";

import { withSearchFilter } from "@app/components/commons/withSearchFilter";

const ProjectsFilter = withSearchFilter({
  basePath: "/dashboard/projects",
  searchPlaceholder: "Find your project",
  createLabel: "New project",
  createPath: "/dashboard/projects/create",
});

export default ProjectsFilter;
