import { GoogleAnalytics } from "@next/third-parties/google";
import Transition from "@resources/components/common/Transition";
import PostView from "@resources/components/features/Post/PostView";
import { BASE_URL, GOOGLE_ANALYTIC } from "lib/commons/constants/base";
import { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug, getPosts } from "server/actions/blogActions";

export const revalidate = 60;
export const dynamicParams = true;

interface MetaDataParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: MetaDataParams, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const currentPostURL = new URL(`${BASE_URL}/posts/${slug}`);

  // Extract a clean description from content (remove HTML tags)
  const cleanDescription =
    post.content
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
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
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.createdAt).toISOString(),
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
    alternates: {
      canonical: currentPostURL,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts: Post[] = await getPosts({ published: true });
    return posts.map((post) => ({
      slug: String(post.slug),
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const post = await getPostBySlug(slug);
  if (!post) return <h1>Not Found</h1>;

  return (
    <Transition>
      <PostView post={post} />
      {GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
    </Transition>
  );
}
