import styles from "../../landing.module.css";
import { Post } from "@app/resources/types/post.types";
import PublicPostCard from "@resources/components/content/PublicPostCard";
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
      {posts.map((post, i) => (
        <PublicPostCard key={post.slug} post={post} className={styles.fade} transitionDelay={`${i * 0.08}s`} />
      ))}
    </div>
  );
}
