import { PostObservers } from "./components/PostObservers";
import SiteFooter from "./components/SiteFooter";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./post.module.css";
import MarkdownRenderer from "@resources/components/content/MarkdownRenderer";
import { PostJSON } from "@server/models/post.model";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface PostDetailPageProps {
  post: PostJSON;
  nextPost?: PostJSON | null;
}

function readingTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export default function PostDetailPage({ post, nextPost }: PostDetailPageProps) {
  const date = new Date(post.publishedAt || post.createdAt);
  const formattedDate = format(date, "MMMM d, yyyy");
  const updatedDate = format(new Date(post.updatedAt), "MMM d, yyyy");
  const minutes = readingTime(post.content);

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
        <ThemeToggle className={styles.navToggle} />
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
                <span className={styles.tagChip}>Technology</span>
                <span className={styles.metaTextInv}>{formattedDate}</span>
                <span className={styles.metaDotInv} />
                <span className={styles.metaTextInv}>{minutes}</span>
              </div>
            </div>
          ) : (
            <div className={styles.heroCardPlaceholder}>
              <div className={styles.heroCardMeta}>
                <span className={styles.tagChip}>Technology</span>
                <span className={styles.metaTextInv}>{formattedDate}</span>
                <span className={styles.metaDotInv} />
                <span className={styles.metaTextInv}>{minutes}</span>
              </div>
            </div>
          )}

          {/* Title below card */}
          <div className={styles.postTitleWrap}>
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

        {/* ── NEXT POST ── */}
        {nextPost && (
          <div className={`${styles.nextWrap} ${styles.fade}`}>
            <Link className={styles.nextCard} href={`/posts/${nextPost.slug}`}>
              <div>
                <div className={styles.nextLabel}>Next post</div>
                <div className={styles.nextTitle}>{nextPost.title}</div>
              </div>
              <span className={styles.nextArrow}>↗</span>
            </Link>
          </div>
        )}
      </article>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
