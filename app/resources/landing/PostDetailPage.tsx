import { PostObservers } from "./components/PostObservers";
import SiteFooter from "./components/SiteFooter";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./post.module.css";
import { readingTime } from "@lib/utils/helper";
import MarkdownRenderer from "@resources/components/content/MarkdownRenderer";
import { CategoryJSON } from "@server/models/category.model";
import { PostJSON } from "@server/models/post.model";
import { SeriesJSON } from "@server/models/series.model";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface PostDetailPageProps {
  post: PostJSON;
  category?: CategoryJSON | null;
  series?: SeriesJSON | null;
  relatedPosts?: PostJSON[];
}

export default function PostDetailPage({ post, category, series, relatedPosts = [] }: PostDetailPageProps) {
  const date = new Date(post.publishedAt || post.createdAt);
  const formattedDate = format(date, "MMMM d, yyyy");
  const updatedDate = format(new Date(post.updatedAt), "MMM d, yyyy");
  const minutes = readingTime(post.content);
  const categoryLabel = category?.name ?? "Technology";

  return (
    <div className={styles.page}>
      <PostObservers />

      {/* ── NAV ── */}
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLogo} href="/">
          tuanhuydev
        </Link>
        <div className={styles.navSep} />
        <Link className={styles.navLink} href="/posts">
          Posts
        </Link>
        <ThemeToggle />
        <Link className={styles.navCta} href="/#contact">
          Contact
        </Link>
      </nav>

      <article className={styles.article}>
        {/* ── HEADER ── */}
        <header className={`${styles.postHeader} ${styles.fade}`}>
          <Link className={styles.backLink} href="/posts">
            ← Back to posts
          </Link>

          {/* Hero card */}
          {post.thumbnail ? (
            <div className={styles.heroCard}>
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) calc(100vw - 80px), 1120px"
                className={styles.heroCardImg}
                priority
              />
              <div className={styles.heroCardOverlay} />
              <div className={styles.heroCardMeta}>
                {category ? (
                  <Link className={styles.tagChip} href={`/posts?category=${category.slug}`}>
                    {categoryLabel}
                  </Link>
                ) : (
                  <span className={styles.tagChip}>{categoryLabel}</span>
                )}
                <span className={styles.metaTextInv}>{formattedDate}</span>
                <span className={styles.metaDotInv} />
                <span className={styles.metaTextInv}>{minutes}</span>
              </div>
            </div>
          ) : (
            <div className={styles.heroCardPlaceholder}>
              <div className={styles.heroCardMeta}>
                {category ? (
                  <Link className={styles.tagChip} href={`/posts?category=${category.slug}`}>
                    {categoryLabel}
                  </Link>
                ) : (
                  <span className={styles.tagChip}>{categoryLabel}</span>
                )}
                <span className={styles.metaTextInv}>{formattedDate}</span>
                <span className={styles.metaDotInv} />
                <span className={styles.metaTextInv}>{minutes}</span>
              </div>
            </div>
          )}

          {/* Title below card */}
          <div className={styles.postTitleWrap}>
            {series && (
              <Link className={styles.seriesChip} href={`/posts?series=${series.slug}`}>
                Part of <strong>{series.name}</strong>
              </Link>
            )}
            <h1 className={styles.postTitle}>{post.title}</h1>
          </div>
        </header>

        {/* ── PROSE BODY ── */}
        <div className={`${styles.prose} ${styles.fade}`}>
          <MarkdownRenderer content={post.content} />
        </div>

        {/* ── AUTHOR ── */}
        <div className={`${styles.author} ${styles.fade}`}>
          <div className={styles.authorAvatar}>H</div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>Huy Nguyen Tuan</div>
            <div className={styles.authorSub}>Senior Software Engineer · Last updated {updatedDate}</div>
          </div>
        </div>

        {/* ── SUGGESTED POSTS ── */}
        {relatedPosts.length > 0 && (
          <div className={`${styles.suggestedWrap} ${styles.fade}`}>
            <p className={styles.suggestedLabel}>Keep reading</p>
            <div className={styles.suggestedGrid}>
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} className={styles.suggestedCard} href={`/posts/${relatedPost.slug}`}>
                  <p className={styles.suggestedDate}>
                    {format(new Date(relatedPost.publishedAt || relatedPost.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p className={styles.suggestedTitle}>{relatedPost.title}</p>
                  <span className={styles.suggestedArrow}>↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
