import Loader from "@lib/components/commons/Loader";
import { Post } from "@prisma/client";
import dynamic from "next/dynamic";
import React from "react";

const HighlightPost = dynamic(() => import("./HighlightPost"), { ssr: false, loading: () => <Loader /> });

export default function BlogSection({ posts }: { posts: Post[] }) {
  const makeColumn = (index: number) => {
    const firstItemIndex = 0;
    return index === firstItemIndex ? "lg:row-span-full" : "lg:row-span-3";
  };

  if (!posts.length) return <></>;

  return (
    <section id="blog">
      <h3 className="text-center text-primary dark:text-slate-50 font-bold text-base md:text-3xl lg:text-4xl mb-3">
        &ldquo;Keep Learning is a Way to Success&rdquo;
      </h3>
      <h4 className="text-slate-700 text-xs w-4/5 dark:text-slate-400 text-center mx-auto mb-5">
        <span className="break-keep text-xs md:text-sm lg:text-base inline-block">
          Explore new ideas and expand your understanding through my blog posts.
        </span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-homePosts lg:grid-cols-homePosts gap-y-8 gap-x-6 p-3 grid-flow-row">
        {posts.map((post: Post, index: number) => (
          <HighlightPost key={post.title} post={post} className={makeColumn(index)} />
        ))}
      </div>
    </section>
  );
}
