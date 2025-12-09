"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@resources/components/common/Card";
import { usePostsQuery } from "@resources/queries/postQueries";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function PostWidget() {
  const { data: posts = [] } = usePostsQuery();

  return (
    <Link href={"/dashboard/posts"} prefetch className="self-baseline">
      <Card className="w-[12rem] min-h-[8rem]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Posts</CardTitle>
          <FileText className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{posts?.length || 0}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
