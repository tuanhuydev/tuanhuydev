import styles from "../../landing.module.css";
import { Post } from "@app/resources/types/post.types";
import { format } from "date-fns";
import Link from "next/link";
import { getPosts } from "server/actions/blogActions";

export default async function BlogSection() {
  let posts: Post[] = [];
  try {
    posts = await getPosts({ page: 1, pageSize: 3, publishedAt: true });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  if (!posts.length) return null;

  return (
    <div className={styles.postsRow}>
      {posts.map((post, i) => {
        const date = new Date(post.publishedAt || post.createdAt);
        return (
          <Link
            key={post.slug}
            className={`${styles.postCard} ${styles.fade}`}
            href={`/posts/${post.slug}`}
            style={{ transitionDelay: `${i * 0.08}s` }}>
            <p className={styles.postDate}>{format(date, "MMM dd, yyyy")}</p>
            <p className={styles.postTitle}>{post.title}</p>
            <span className={styles.postArrow}>↗</span>
          </Link>
        );
      })}
    </div>
  );
}
