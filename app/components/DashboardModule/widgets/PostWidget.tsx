"use client";

import { usePostsQuery } from "@app/_queries/postQueries";
import Card from "@app/components/commons/Card";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import Link from "next/link";

export default function PostWidget() {
  const { data: posts = [] } = usePostsQuery();

  return (
    <Link href={"/dashboard/posts"} prefetch className="self-baseline">
      <Card title="Posts" className="w-[12rem] min-h-[8rem]" value={posts?.length} icon={<ArticleOutlined />} />
    </Link>
  );
}
