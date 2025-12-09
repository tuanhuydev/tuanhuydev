"use client";

import { withSearchFilter } from "@resources/components/common/withSearchFilter";

const ProjectsFilter = withSearchFilter({
  basePath: "/dashboard/projects",
  searchPlaceholder: "Find your project",
  createLabel: "New project",
  createPath: "/dashboard/projects/create",
});

export default ProjectsFilter;
