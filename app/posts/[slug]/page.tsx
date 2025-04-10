import Transition from "@app/components/commons/Transition";
import { GoogleAnalytics } from "@next/third-parties/google";
import { BASE_URL, GOOGLE_ANALYTIC } from "lib/commons/constants/base";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { getPostBySlug, getPosts } from "server/actions/blogActions";

const PostView = dynamic(() => import("@app/components/PostModule/PostView"), { ssr: false });

export const revalidate = 60;
export const dynamicParams = true;

interface MetaDataParams {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MetaDataParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const currentPostURL = new URL(`${BASE_URL}/posts/${slug}`);

  return {
    title: post.title,
    metadataBase: currentPostURL,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      url: currentPostURL,
      images: [post.thumbnail ?? "", ...previousImages],
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
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  try {
    const post = await getPostBySlug(slug);
    if (!post) return <h1>Not Found</h1>;

    return (
      <Transition>
        <PostView post={post} />
        {GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
      </Transition>
    );
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return <h1>Failed to load post</h1>;
  }
}
