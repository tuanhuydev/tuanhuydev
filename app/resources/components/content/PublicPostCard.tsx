import styles from "./PublicPostCard.module.css";
import type { Post } from "@app/resources/types/post.types";
import { format } from "date-fns";
import Link from "next/link";

export interface PublicPostCardProps {
  post: Post;
  /** Optional category name shown as a badge above the title. */
  category?: string | null;
  /** CSS transition-delay value for staggered fade-in animations (e.g. "0.08s"). */
  transitionDelay?: string;
  /** Extra class names forwarded to the root element (e.g. scroll-fade class). */
  className?: string;
}

export default function PublicPostCard({ post, category, transitionDelay, className }: PublicPostCardProps) {
  const date = new Date(post.publishedAt || post.createdAt);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`${styles.card}${className ? ` ${className}` : ""}`}
      style={transitionDelay ? { transitionDelay } : undefined}>
      {category ? (
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <p className={styles.date}>{format(date, "MMM dd, yyyy")}</p>
        </div>
      ) : (
        <p className={styles.date}>{format(date, "MMM dd, yyyy")}</p>
      )}
      <p className={styles.title}>{post.title}</p>
      <span className={styles.arrow} aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
