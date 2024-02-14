import Loader from "../commons/Loader";
import ImageWithFallback from "@components/commons/ImageWithFallback";
import { DATE_FORMAT } from "@lib/configs/constants";
import { CardProps } from "antd/es/card";
import Descriptions from "antd/es/descriptions";
import format from "date-fns/format";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";

const Card = dynamic(async () => (await import("antd/es/card")).default, { ssr: false, loading: () => <Loader /> });
const Tag = dynamic(async () => (await import("antd/es/tag")).default, { ssr: false, loading: () => <Loader /> });

export interface PostCardProps {
  post: any;
  onClick: (id: number) => void;
  CardProps?: Partial<CardProps>;
}

export default function PostCard({ post, onClick, CardProps }: PostCardProps) {
  const { title, thumbnail = "", publishedAt, createdAt } = post;

  const handleCardClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      onClick(post.id);
    },
    [onClick, post.id],
  );

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
    <Card {...CardProps} hoverable rootClassName="w-[18rem]" onClick={handleCardClick} loading={!post}>
      <div className="relative aspect-[3/2] rounded-sm mb-3">
        <ImageWithFallback alt={title} className="rounded-sm object-cover" fill sizes="100vw" src={thumbnail} />
      </div>
      <h4 className="font-semibold text-xl mb-2 grow truncate">{title}</h4>
      <div className="flex flex-nowrap items-center justify-between">
        <Descriptions.Item label="Create at">{format(new Date(createdAt), DATE_FORMAT)}</Descriptions.Item>
        <Descriptions.Item label="Status">{Status}</Descriptions.Item>
      </div>
    </Card>
  );
}