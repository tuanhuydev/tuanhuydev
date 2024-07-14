import BaseCard from "../commons/Card";
import Loader from "../commons/Loader";
import { DATE_FORMAT } from "@lib/configs/constants";
import format from "date-fns/format";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

const Tag = dynamic(async () => (await import("antd/es/tag")).default, { ssr: false, loading: () => <Loader /> });

export interface PostCardProps {
  post: ObjectType;
  actions?: React.ReactNode;
}

export default function PostCard({ post, actions }: PostCardProps) {
  const router = useRouter();

  const { title, thumbnail = "", publishedAt, createdAt } = post;
  const isPostLoading = !post;

  const navigateProjectEdit = useCallback(() => {
    router.push(`/dashboard/posts/${(post as ObjectType).id}`);
  }, [post, router]);

  const Status: JSX.Element = useMemo(() => {
    const isPublished = !!publishedAt;
    const color = isPublished ? "success" : "warning";
    const content = isPublished ? "published" : "draft";

    return (
      <Tag bordered={false} color={color} className="capitalize">
        {content}
      </Tag>
    );
  }, [publishedAt]);

  return (
    <BaseCard
      title={title}
      className="w-[18rem]"
      imageSrc={thumbnail as string}
      hasImage
      onClick={navigateProjectEdit}
      loading={isPostLoading}>
      <div className="flex flex-nowrap items-center justify-between">
        <div className="text-sm font-medium text-primary dark:text-slate-50">
          {createdAt ? format(new Date(createdAt), DATE_FORMAT) : "-"}
        </div>
        {Status}
      </div>
      {actions && <div className="mt-3 flex gap-3 justify-end">{actions}</div>}
    </BaseCard>
  );
}
