"use client";

import { Card, CardContent, CardHeader } from "../../common/Card";
import BaseImage from "../../content/BaseImage";
import styles from "./PostCard.module.css";
import { Post } from "@app/resources/types/post.types";
import clsx from "clsx";
import { format } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import Link from "next/link";
import React, { memo, useMemo, type JSX } from "react";

export interface PostCardProps {
  post: Post;
  actions?: React.ReactNode;
}

const PostCard = memo(function PostCard({ post, actions }: PostCardProps) {
  const { title, thumbnail = "", publishedAt, createdAt } = post;

  const Status: JSX.Element = useMemo(() => {
    const isPublished = !!publishedAt;
    const content = isPublished ? "published" : "draft";

    return (
      <div className={clsx(styles.status, isPublished ? styles.statusPublished : styles.statusDraft)}>{content}</div>
    );
  }, [publishedAt]);

  return (
    <Card className={styles.card}>
      {/* Card overlay link — covers the whole card except nested actions */}
      <Link href={`/dashboard/posts/${post.id}`} className={styles.cardOverlay} aria-label={`Edit post: ${title}`} />
      <div className={styles.thumbnail}>
        {thumbnail && <BaseImage src={thumbnail} alt={title} fill className={styles.thumbnailImg} />}
      </div>
      <CardHeader>
        <h3 className={styles.title}>{title}</h3>
      </CardHeader>
      <CardContent>
        <div className={styles.footerRow}>
          <div className={styles.date}>{createdAt ? format(new Date(createdAt), DATE_FORMAT) : "-"}</div>
          {Status}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";
export default PostCard;
