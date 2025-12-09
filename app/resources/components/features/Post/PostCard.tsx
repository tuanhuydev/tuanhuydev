"use client";

import { Card, CardContent, CardHeader } from "../../common/Card";
import BaseImage from "../../content/BaseImage";
import { format } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useMemo, type JSX } from "react";

export interface PostCardProps {
  post: ObjectType;
  actions?: React.ReactNode;
}

const PostCard = memo(function PostCard({ post, actions }: PostCardProps) {
  const router = useRouter();

  const { title, thumbnail = "", publishedAt, createdAt } = post;

  const navigateProjectEdit = useCallback(() => {
    router.push(`/dashboard/posts/${(post as ObjectType).id}`);
  }, [post, router]);

  const Status: JSX.Element = useMemo(() => {
    const isPublished = !!publishedAt;
    const color = isPublished ? "bg-green-100 text-green-400" : "bg-amber-100 text-amber-400";
    const content = isPublished ? "published" : "draft";

    return (
      <div color={color} className={`text-xs py-1 px-3 rounded-md capitalize ${color}`}>
        {content}
      </div>
    );
  }, [publishedAt]);

  return (
    <Card className="w-full md:w-[18rem] cursor-pointer" onClick={navigateProjectEdit}>
      <div className="relative w-full h-40 overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-700">
        {thumbnail && <BaseImage src={thumbnail as string} alt={title} fill className="object-cover" />}
      </div>
      <CardHeader>
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-nowrap items-center justify-between">
          <div className="text-sm font-medium text-primary dark:text-slate-50">
            {createdAt ? format(new Date(createdAt), DATE_FORMAT) : "-"}
          </div>
          {Status}
        </div>
        {actions && <div className="mt-3 flex gap-3 justify-end">{actions}</div>}
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";
export default PostCard;
