import WithCopy from "../../common/hocs/WithCopy";
import BaseImage from "../../content/BaseImage";
import { Post } from "@app/resources/types/post.types";
import MarkdownRenderer from "@resources/components/content/MarkdownRenderer";
import { LinkIcon, Calendar, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";

export interface PostViewProps {
  post: Post;
}

export default function PostView({ post }: PostViewProps) {
  if (!post) return <h1>Not Found</h1>;

  // Calculate reading time on server (no useMemo needed)
  const words = post.content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  const readingTime = `${minutes} min read`;

  // Format date on server (no useMemo needed)
  const date = post.publishedAt ? post.publishedAt : post.createdAt;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero section with thumbnail */}
      {post.thumbnail ? (
        <div className="w-full md:w-4/5 xl:w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
          <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
            <BaseImage src={post.thumbnail} alt={post.title} fill sizes="100vw" preload className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />

            {/* Title overlay for all screen sizes */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <Link
                href="/posts"
                aria-label="Go back to posts"
                className="inline-flex items-center gap-2 text-slate-200 hover:text-white mb-3 transition-colors group">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Back</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main article content */}
      <article className="w-full md:w-4/5 xl:w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Article header */}
        <header className="mb-8 lg:mb-12">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <time
              dateTime={post.publishedAt ? post.publishedAt : post.createdAt}
              className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </time>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingTime}
            </span>
          </div>
        </header>

        {/* Article body */}
        <div className="py-4 px-2">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Article footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Last updated:{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <WithCopy content={`https://tuanhuy.dev/posts/${post.slug}`} title="Share">
              <button className="inline-flex items-center gap-2 rounded-full bg-stone-900 dark:bg-slate-50 text-slate-50 dark:text-stone-900 text-sm uppercase font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-shadow">
                <LinkIcon className="w-4 h-4" />
                Share Article
              </button>
            </WithCopy>
          </div>
        </footer>
      </article>
    </div>
  );
}
