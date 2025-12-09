"use client";

import { withSearchFilter } from "@resources/components/common/withSearchFilter";

const PostsFilter = withSearchFilter({
  basePath: "/dashboard/posts",
  searchPlaceholder: "Find your post",
  createLabel: "New post",
  createPath: "/dashboard/posts/create",
});

export default PostsFilter;
