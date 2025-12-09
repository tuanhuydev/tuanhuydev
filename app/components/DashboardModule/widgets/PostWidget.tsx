"use client";

import { usePostsQuery } from "@app/_queries/postQueries";
import Card from "@app/components/commons/Card";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function PostWidget() {
  const { data: posts = [] } = usePostsQuery();

  return (
    <Link href={"/dashboard/posts"} prefetch className="self-baseline">
      <Card
        title="Posts"
        className="w-[12rem] min-h-[8rem]"
        value={posts?.length}
        icon={<FileText className="w-5 h-5" />}
      />
    </Link>
  );
}
