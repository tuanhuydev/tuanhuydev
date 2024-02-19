import Loader from "@components/commons/Loader";
import { BASE_URL, EMPTY_STRING } from "@lib/configs/constants";
import { Metadata, ResolvingMetadata } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import dynamic from "next/dynamic";
import React from "react";

const ImageWithFallback = dynamic(async () => (await import("@components/commons/ImageWithFallback")).default, {
  ssr: false,
  loading: () => <Loader />,
});

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const response = await fetch(`${BASE_URL}/api/posts/${slug}`, { cache: "no-store" });
  if (!response.ok) return {};

  const { data: post } = await response.json();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post?.title,
    metadataBase: new URL("https://tuanhuy.dev"),
    openGraph: {
      images: [post?.thumbnail, ...previousImages],
    },
  };
}

async function getData(slug: string) {
  const response = await fetch(`${BASE_URL}/api/posts/${slug}`, { cache: "no-store" });
  if (!response.ok) return {};

  const { data: post } = await response.json();
  return post;
}

export default async function Page({ params }: any) {
  const { slug } = params;

  const post = await getData(slug);
  if (!post) return <h1>Not Found</h1>;

  return (
    <div className="grid grid-rows-post">
      <div className="background row-start-1 col-span-full relative opacity-75">
        <ImageWithFallback
          src={post.thumbnail ?? EMPTY_STRING}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid lg:grid-cols-12 -mt-20 relative z-20">
        <div className="col-start-3 col-span-9 p-4 shadow-md bg-white text-slate-primary dark:bg-primary dark:text-slate-50 rounded-md">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold rounded-md mb-3 p-3">{post.title}</h1>
          <div className="!text-sm lg:!text-base bg-white dark:bg-transparent p-3">
            {(<MDXRemote source={post.content as MDXRemoteSerializeResult} />) as any}
          </div>
        </div>
      </div>
    </div>
  );
}
