import { Post } from "@app/resources/types/post.types";
import PostDetailPage from "@resources/landing/PostDetailPage";
import { BASE_URL } from "lib/commons/constants/base";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "server/actions/blogActions";
import { getCategories } from "server/actions/categoryActions";
import { getAllSeries } from "server/actions/seriesActions";
import { getTags } from "server/actions/tagActions";

export const revalidate = 60;
export const dynamicParams = true;

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post || !post.publishedAt) return {};

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  const category = categories.find((c) => c.id === post.categoryId);
  const postTags = tags.filter((tag) => post.tagIds?.includes(tag.id ?? ""));

  const previousImages = (await parent).openGraph?.images || [];
  const currentPostURL = new URL(`${BASE_URL}/posts/${slug}`);

  const cleanDescription =
    post.content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 155) + (post.content.length > 155 ? "..." : "");

  const keywordList = [post.title, "tuanhuydev", category?.name, ...postTags.map((tag) => tag.name)].filter(
    Boolean,
  ) as string[];

  return {
    title: `${post.title} | tuanhuydev`,
    description: cleanDescription,
    keywords: keywordList.join(", "),
    authors: [{ name: "Huy Nguyen Tuan", url: BASE_URL }],
    creator: "Huy Nguyen Tuan",
    publisher: "tuanhuydev",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: currentPostURL,
      siteName: "tuanhuydev",
      images: [
        {
          url: post.thumbnail ?? "/assets/images/preview.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages,
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      section: category?.name ?? "Technology",
      tags: postTags.length ? postTags.map((tag) => tag.name) : ["web development", "programming", "technology"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: [post.thumbnail ?? "/assets/images/preview.png"],
      creator: "@tuanhuydev",
    },
    alternates: { canonical: currentPostURL },
  };
}

export async function generateStaticParams() {
  try {
    const posts: Post[] = await getPosts({ publishedAt: true });
    return posts.map((post) => ({ slug: String(post.slug) }));
  } catch {
    return [];
  }
}

function pickRelatedPosts(current: Post, candidates: Post[], limit: number): Post[] {
  const pool = candidates.filter((candidate) => candidate.slug !== current.slug);

  const byCategory = current.categoryId ? pool.filter((candidate) => candidate.categoryId === current.categoryId) : [];
  const bySeries = current.seriesId ? pool.filter((candidate) => candidate.seriesId === current.seriesId) : [];

  const related: Post[] = [];
  const seen = new Set<string>();
  const addAll = (list: Post[]) => {
    for (const candidate of list) {
      if (related.length >= limit) break;
      if (seen.has(candidate.slug)) continue;
      seen.add(candidate.slug);
      related.push(candidate);
    }
  };

  addAll(byCategory);
  addAll(bySeries);
  addAll(pool);

  return related.slice(0, limit);
}

export default async function Page(props: PageParams) {
  const { slug } = await props.params;

  const [post, allPosts, categories, series] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ publishedAt: true, sortBy: "publishedAt", sortOrder: "desc" }),
    getCategories(),
    getAllSeries(),
  ]);

  if (!post || !post.publishedAt) notFound();

  const category = categories.find((c) => c.id === post.categoryId) ?? null;
  const postSeries = series.find((s) => s.id === post.seriesId) ?? null;
  const relatedPosts = pickRelatedPosts(post, allPosts, 3);

  const blogPostingLinkingData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200),
    image: post.thumbnail ? [post.thumbnail] : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { "@type": "Person", name: "Huy Nguyen Tuan", url: BASE_URL },
    publisher: { "@type": "Organization", name: "tuanhuydev", url: BASE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/posts/${slug}` },
    articleSection: category?.name,
    keywords: category?.name,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLinkingData) }} />
      <PostDetailPage post={post} category={category} series={postSeries} relatedPosts={relatedPosts} />
    </>
  );
}
