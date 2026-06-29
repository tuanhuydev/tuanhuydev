import { Post } from "@app/resources/types/post.types";
import { GoogleAnalytics } from "@next/third-parties/google";
import PostDetailPage from "@resources/landing/PostDetailPage";
import { GOOGLE_ANALYTIC } from "lib/commons/constants/base";
import { BASE_URL } from "lib/commons/constants/base";
import { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug, getPosts } from "server/actions/blogActions";

export const revalidate = 60;
export const dynamicParams = true;

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const currentPostURL = new URL(`${BASE_URL}/posts/${slug}`);

  const cleanDescription =
    post.content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 155) + (post.content.length > 155 ? "..." : "");

  return {
    title: `${post.title} | tuanhuydev`,
    metadataBase: new URL(BASE_URL),
    description: cleanDescription,
    keywords: `${post.title}, tuanhuydev, blog, web development, programming`,
    authors: [{ name: "Huy Nguyen Tuan", url: "https://tuanhuy.dev" }],
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
      section: "Technology",
      tags: ["web development", "programming", "technology"],
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
    const posts: Post[] = await getPosts({ published: true });
    return posts.map((post) => ({ slug: String(post.slug) }));
  } catch {
    return [];
  }
}

export default async function Page(props: PageParams) {
  const { slug } = await props.params;

  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ publishedAt: true, sortBy: "publishedAt", sortOrder: "desc" }),
  ]);

  if (!post) return <h1>Not Found</h1>;

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      <PostDetailPage post={post} nextPost={nextPost} />
      {GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
    </>
  );
}
