import { PostsScrollFadeObserver } from "./components/PostsScrollFadeObserver";
import SiteFooter from "./components/SiteFooter";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./posts.module.css";
import { PostJSON } from "@server/models/post.model";
import { format } from "date-fns";
import Link from "next/link";
import { getPosts } from "server/actions/blogActions";

export default async function PostsPage() {
  let posts: PostJSON[] = [];
  try {
    posts = await getPosts({ publishedAt: true, sortBy: "publishedAt", sortOrder: "desc" });
  } catch {
    // render with empty list
  }

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <div className={styles.page}>
      <PostsScrollFadeObserver />

      {/* ── NAV ── */}
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLogo} href="/">
          tuanhuydev
        </Link>
        <ThemeToggle className={styles.navToggle} />
        <Link className={styles.navCta} href="/#contact">
          Contact
        </Link>
      </nav>

      {/* ── PAGE HEADER ── */}
      <header className={styles.pageHeader}>
        <p className={styles.phEyebrow}>Writing</p>
        <h1 className={styles.phTitle}>Posts</h1>
        <p className={styles.phSub}>
          Thoughts on software engineering, career growth, and building things that matter.
        </p>
        <div className={styles.phMeta}>
          <span className={styles.phCount}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className={styles.content}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet. Check back soon.</p>
        ) : (
          <>
            {/* ── FEATURED POST ── */}
            {featured && (
              <Link className={`${styles.featuredLink} ${styles.fade}`} href={`/posts/${featured.slug}`}>
                <div className={styles.featuredCard}>
                  <div className={styles.featuredBadge}>
                    <span className={styles.featuredBadgeDot} />
                    Latest post
                  </div>
                  <div className={styles.featuredInner}>
                    <div className={styles.featuredBody}>
                      <p className={styles.featuredDate}>
                        {format(new Date(featured.publishedAt || featured.createdAt), "MMM dd, yyyy")}
                      </p>
                      <h2 className={styles.featuredTitle}>{featured.title}</h2>
                    </div>
                    <span className={styles.featuredArrow}>↗</span>
                  </div>
                </div>
              </Link>
            )}

            {/* ── ALL POSTS GRID ── */}
            {rest.length > 0 && (
              <>
                <p className={`${styles.gridLabel} ${styles.fade}`}>All Posts</p>
                <div className={styles.postsGrid}>
                  {rest.map((post, i) => (
                    <Link
                      key={post.slug}
                      className={`${styles.postCard} ${styles.fade}`}
                      href={`/posts/${post.slug}`}
                      style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
                      <p className={styles.postDate}>
                        {format(new Date(post.publishedAt || post.createdAt), "MMM dd, yyyy")}
                      </p>
                      <p className={styles.postTitle}>{post.title}</p>
                      <span className={styles.postArrow}>↗</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
