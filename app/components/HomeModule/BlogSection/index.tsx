"use client";

import Loader from "@app/components/commons/Loader";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HighlightPost = dynamic(() => import("./HighlightPost"), { loading: () => <Loader /> });

const makeColumn = (index: number) => {
  const firstItemIndex = 0;
  return index === firstItemIndex ? "lg:row-span-4" : "lg:row-span-3";
};

export default function BlogSection({ posts }: { posts: ObjectType[] }) {
  if (!posts.length) return <>Not found</>;

  return (
    <section id="blog" className="flex flex-col items-center">
      {/* Title & Description */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-xl md:text-3xl lg:text-4xl mb-3 bg-gradient-to-r from-slate-800 to-amber-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
        Reading Station
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-4 text-gray-600 dark:text-gray-300 text-base md:text-lg text-center lg:text-left max-w-2xl mx-auto leading-relaxed">
        Explore new ideas and expand your understanding through my blog posts.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-homePosts lg:grid-cols-6 w-3/4 gap-y-6 gap-x-4 p-3 grid-flow-row">
        {posts.map((post: ObjectType, index: number) => (
          <HighlightPost key={post.title} post={post} className={makeColumn(index)} />
        ))}
      </div>
    </section>
  );
}
