import Card from "@app/_components/commons/Card";
import { getPosts } from "@app/server/actions/blog";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import Link from "next/link";
import React from "react";

export default async function PostWidget() {
  const posts = await getPosts();
  return (
    <Link href={"/dashboard/posts"} prefetch className="self-baseline">
      <Card title="Posts" className="w-[12rem] min-h-[8rem]" value={posts?.length} icon={<ArticleOutlined />} />
    </Link>
  );
}
