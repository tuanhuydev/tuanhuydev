import Loader from "@lib/components/commons/Loader";
import { BASE_URL, EMPTY_STRING } from "@lib/configs/constants";
import "@mdxeditor/editor/style.css";
import dynamic from "next/dynamic";
import React from "react";

const ImageWithFallback = dynamic(async () => (await import("@lib/components/commons/ImageWithFallback")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const MarkdownPreview = dynamic(async () => (await import("@lib/components/commons/BaseMarkdown")).default, {
  ssr: false,
  loading: () => <Loader />,
});

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
      <div className="background row-start-1 col-span-full relative opacity-40">
        <ImageWithFallback
          src={post.thumbnail ?? EMPTY_STRING}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid lg:grid-cols-12 -mt-10 relative z-20">
        <div className="col-start-3 col-span-9 p-4 shadow-md rounded-md">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-white mb-3 p-3">{post.title}</h1>
          <div className="!text-sm lg:!text-base bg-white p-3">
            <MarkdownPreview value={post.content} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
