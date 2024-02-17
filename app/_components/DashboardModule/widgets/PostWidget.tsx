"use client";

import Card from "@app/_components/commons/Card";
import { usePostsQuery } from "@app/queries";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import Link from "next/link";
import React from "react";

export default function PostWidget() {
  const { data: posts, isLoading: isPostLoading } = usePostsQuery();

  return (
    <Link href={"/dashboard/posts"} prefetch className="self-baseline">
      <Card
        title="Posts"
        className="w-[12rem] min-h-[8rem]"
        value={posts?.length}
        loading={isPostLoading}
        icon={<ArticleOutlined />}
      />
    </Link>
  );
}
