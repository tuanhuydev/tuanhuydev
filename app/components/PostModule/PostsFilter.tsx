"use client";

import { withSearchFilter } from "@app/components/commons/withSearchFilter";

const PostsFilter = withSearchFilter({
  basePath: "/dashboard/posts",
  searchPlaceholder: "Find your post",
  createLabel: "New post",
  createPath: "/dashboard/posts/create",
});

export default PostsFilter;
