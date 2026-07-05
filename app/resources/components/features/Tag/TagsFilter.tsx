"use client";

import { withSearchFilter } from "@resources/components/common/withSearchFilter";

const TagsFilter = withSearchFilter({
  basePath: "/dashboard/tags",
  searchPlaceholder: "Find your tag",
  createLabel: "New tag",
  createPath: "/dashboard/tags/create",
});

export default TagsFilter;
