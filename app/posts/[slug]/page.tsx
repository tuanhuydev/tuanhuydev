import { getPostBySlug } from "@app/server/actions/blog";
import PostView from "@components/PostModule/PostView";
import { BASE_URL } from "@lib/configs/constants";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const response = await fetch(`${BASE_URL}/api/posts/${slug}`, { cache: "no-store" });
  if (!response.ok) return {};

  const { data: post } = await response.json();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post?.title,
    metadataBase: new URL(`${BASE_URL}/posts/${slug}`),
    openGraph: {
      images: [post?.thumbnail, ...previousImages],
    },
  };
}

export default async function Page({ params }: any) {
  const { slug } = params;

  const post = await getPostBySlug(slug);
  if (!post) return <h1>Not Found</h1>;

  return <PostView post={post} />;
}
