import { PostsScrollFadeObserver } from "./components/PostsScrollFadeObserver";
import SiteFooter from "./components/SiteFooter";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./posts.module.css";
import { CategoryJSON } from "@server/models/category.model";
import { PostJSON } from "@server/models/post.model";
import { SeriesJSON } from "@server/models/series.model";
import { format } from "date-fns";
import { BASE_URL } from "lib/commons/constants/base";
import Link from "next/link";
import { getPosts } from "server/actions/blogActions";
import { getCategories } from "server/actions/categoryActions";
import { getAllSeries } from "server/actions/seriesActions";

export interface PostsPageProps {
  searchParams?: { category?: string; series?: string };
}

type CategoryWithCount = CategoryJSON & { count: number };
type SeriesWithCount = SeriesJSON & { count: number };

export default async function PostsPage({ searchParams }: PostsPageProps) {
  let posts: PostJSON[] = [];
  let categories: CategoryJSON[] = [];
  let seriesList: SeriesJSON[] = [];
  try {
    [posts, categories, seriesList] = await Promise.all([
      getPosts({ publishedAt: true, sortBy: "publishedAt", sortOrder: "desc" }),
      getCategories(),
      getAllSeries(),
    ]);
  } catch {
    // render with empty lists
  }

  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const activeCategory = searchParams?.category
    ? categories.find((category) => category.slug === searchParams.category) ?? null
    : null;
  const activeSeries = searchParams?.series
    ? seriesList.find((series) => series.slug === searchParams.series) ?? null
    : null;
  const isFiltered = !!(activeCategory || activeSeries);

  let filteredPosts = posts;
  if (activeCategory) filteredPosts = filteredPosts.filter((post) => post.categoryId === activeCategory.id);
  if (activeSeries) filteredPosts = filteredPosts.filter((post) => post.seriesId === activeSeries.id);

  const recentPosts = posts.slice(0, 3);

  const categoriesWithCounts: CategoryWithCount[] = categories
    .map((category) => ({ ...category, count: posts.filter((post) => post.categoryId === category.id).length }))
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count);

  const seriesWithCounts: SeriesWithCount[] = seriesList
    .map((series) => ({ ...series, count: posts.filter((post) => post.seriesId === series.id).length }))
    .filter((series) => series.count > 0)
    .sort((a, b) => b.count - a.count);

  const spotlightCategory = categoriesWithCounts[0] ?? null;
  const spotlightSeries = seriesWithCounts[0] ?? null;

  const bentoVariant =
    spotlightCategory && spotlightSeries
      ? styles.bentoBothTiles
      : spotlightCategory
      ? styles.bentoCategoryOnly
      : spotlightSeries
      ? styles.bentoSeriesOnly
      : styles.bentoNoTiles;

  const gridPosts = isFiltered ? filteredPosts : posts.slice(recentPosts.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: activeCategory?.name ?? activeSeries?.name ?? "Posts",
    url: `${BASE_URL}/posts`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (isFiltered ? filteredPosts : posts).slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BASE_URL}/posts/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        {isFiltered ? (
          <>
            <p className={styles.phEyebrow}>{activeSeries ? "Series" : "Category"}</p>
            <h1 className={styles.phTitle}>{activeSeries?.name ?? activeCategory?.name}</h1>
            {(activeSeries?.description || activeCategory?.description) && (
              <p className={styles.phSub}>{activeSeries?.description ?? activeCategory?.description}</p>
            )}
            <div className={styles.phMeta}>
              <span className={styles.phCount}>
                {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
              </span>
              <Link className={styles.clearFilter} href="/posts">
                Clear filter ✕
              </Link>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className={styles.content}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet. Check back soon.</p>
        ) : (
          <>
            {/* ── BENTO HERO ── */}
            {!isFiltered && recentPosts.length > 0 && (
              <section className={`${styles.bento} ${bentoVariant} ${styles.fade}`} aria-label="Recent posts">
                <Link className={`${styles.bentoCell} ${styles.bentoFeatured}`} href={`/posts/${recentPosts[0].slug}`}>
                  <div className={styles.bentoBadge}>
                    <span className={styles.bentoBadgeDot} />
                    Latest post
                  </div>
                  <div className={styles.bentoFeaturedBody}>
                    <p className={styles.bentoFeaturedDate}>
                      {format(new Date(recentPosts[0].publishedAt || recentPosts[0].createdAt), "MMM dd, yyyy")}
                    </p>
                    <h2 className={styles.bentoFeaturedTitle}>{recentPosts[0].title}</h2>
                  </div>
                  <span className={styles.bentoArrow}>↗</span>
                </Link>

                {recentPosts[1] && (
                  <Link
                    className={`${styles.bentoCell} ${styles.bentoPost} ${styles.bentoPost2}`}
                    href={`/posts/${recentPosts[1].slug}`}>
                    <p className={styles.bentoPostDate}>
                      {format(new Date(recentPosts[1].publishedAt || recentPosts[1].createdAt), "MMM dd, yyyy")}
                    </p>
                    <p className={styles.bentoPostTitle}>{recentPosts[1].title}</p>
                  </Link>
                )}

                {spotlightCategory && (
                  <Link
                    className={`${styles.bentoCell} ${styles.bentoTile} ${styles.bentoCategoryTile}`}
                    href={`/posts?category=${spotlightCategory.slug}`}>
                    <span className={styles.bentoTileLabel}>Category</span>
                    <span className={styles.bentoTileName}>{spotlightCategory.name}</span>
                    <span className={styles.bentoTileCount}>{spotlightCategory.count} posts</span>
                  </Link>
                )}

                {recentPosts[2] && (
                  <Link
                    className={`${styles.bentoCell} ${styles.bentoPost} ${styles.bentoPost3}`}
                    href={`/posts/${recentPosts[2].slug}`}>
                    <p className={styles.bentoPostDate}>
                      {format(new Date(recentPosts[2].publishedAt || recentPosts[2].createdAt), "MMM dd, yyyy")}
                    </p>
                    <p className={styles.bentoPostTitle}>{recentPosts[2].title}</p>
                  </Link>
                )}

                {spotlightSeries && (
                  <Link
                    className={`${styles.bentoCell} ${styles.bentoTile} ${styles.bentoSeriesTile}`}
                    href={`/posts?series=${spotlightSeries.slug}`}>
                    <span className={styles.bentoTileLabel}>Series</span>
                    <span className={styles.bentoTileName}>{spotlightSeries.name}</span>
                    <span className={styles.bentoTileCount}>{spotlightSeries.count} parts</span>
                  </Link>
                )}
              </section>
            )}

            {/* ── SERIES SHOWCASE ── */}
            {!isFiltered && seriesWithCounts.length > 0 && (
              <section className={`${styles.seriesSection} ${styles.fade}`} aria-label="Series">
                <p className={styles.gridLabel}>Series</p>
                <div className={styles.seriesGrid}>
                  {seriesWithCounts.map((series) => (
                    <Link key={series.id} className={styles.seriesCard} href={`/posts?series=${series.slug}`}>
                      <span className={styles.seriesCardName}>{series.name}</span>
                      {series.description && <span className={styles.seriesCardDesc}>{series.description}</span>}
                      <span className={styles.seriesCardCount}>
                        {series.count} {series.count === 1 ? "part" : "parts"}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── POSTS GRID ── */}
            {gridPosts.length > 0 && (
              <>
                <p className={`${styles.gridLabel} ${styles.fade}`}>{isFiltered ? "Posts" : "All Posts"}</p>
                <div className={styles.postsGrid}>
                  {gridPosts.map((post, i) => {
                    const postCategory = post.categoryId ? categoryMap.get(post.categoryId) : null;
                    return (
                      <Link
                        key={post.slug}
                        className={`${styles.postCard} ${styles.fade}`}
                        href={`/posts/${post.slug}`}
                        style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
                        <div className={styles.postCardMeta}>
                          {postCategory && <span className={styles.postCategory}>{postCategory.name}</span>}
                          <p className={styles.postDate}>
                            {format(new Date(post.publishedAt || post.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <p className={styles.postTitle}>{post.title}</p>
                        <span className={styles.postArrow}>↗</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {isFiltered && gridPosts.length === 0 && <p className={styles.empty}>No posts here yet.</p>}
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
