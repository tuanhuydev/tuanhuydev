"use client";

import { withSearchFilter } from "@resources/components/common/withSearchFilter";

const SeriesFilter = withSearchFilter({
  basePath: "/dashboard/series",
  searchPlaceholder: "Find your series",
  createLabel: "New series",
  createPath: "/dashboard/series/create",
});

export default SeriesFilter;
