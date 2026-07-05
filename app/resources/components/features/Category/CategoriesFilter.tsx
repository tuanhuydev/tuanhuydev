"use client";

import { withSearchFilter } from "@resources/components/common/withSearchFilter";

const CategoriesFilter = withSearchFilter({
  basePath: "/dashboard/categories",
  searchPlaceholder: "Find your category",
  createLabel: "New category",
  createPath: "/dashboard/categories/create",
});

export default CategoriesFilter;
