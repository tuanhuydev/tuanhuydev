import PostView from "@app/components/PostModule/PostView";
import { getPostBySlug } from "@app/server/actions/blog";
import { BASE_URL } from "@lib/configs/constants";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { Fragment } from "react";

const GoogleAdsense = dynamic(() => import("@app/components/GoogleAdsense"), { ssr: false });

export async function generateMetadata({ params }: MetaDataParams, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const currentPostURL = new URL(`${BASE_URL}/posts/${slug}`);

  return {
    title: post.title,
    metadataBase: currentPostURL,
    description: post.content,
    openGraph: {
      title: post.title,
      url: currentPostURL,
      images: [post?.thumbnail, ...previousImages],
    },
    alternates: {
      canonical: currentPostURL,
    },
  };
}

export default async function Page({ params }: any) {
  const { slug } = params;

  const post = await getPostBySlug(slug);
  if (!post) return <h1>Not Found</h1>;

  return (
    <Fragment>
      <PostView post={post} />
      <GoogleAdsense />
    </Fragment>
  );
}
