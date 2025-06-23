import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export interface HighlightPostProps {
  post: ObjectType;
  className?: string;
}

export default function HighlightPost({ post, className }: HighlightPostProps) {
  const { title, thumbnail = "", createdAt } = post;
  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch
      className={`col-span-full md:col-span-1 lg:col-span-2 rounded-md 
                  transition-all duration-300 ease-out cursor-pointer drop-shadow-md
                  hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  will-change-transform ${className}`}>
      <div
        className="z-0 h-full flex flex-col rounded-md relative 
                   bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-5
                   contain-layout transition-colors duration-200">
        <div
          className="w-full min-h-[12rem] grow relative mb-2 overflow-hidden rounded-md
                     contain-layout">
          {thumbnail && (
            <Image
              src={thumbnail}
              className="object-cover transition-transform duration-500 hover:scale-105
                         will-change-transform"
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          )}
        </div>
        <div className="mt-auto">
          <h4
            className="text-base lg:text-2xl my-0 mb-1 font-bold capitalize line-clamp-2
                       text-slate-900 dark:text-slate-50">
            {title}
          </h4>
          <p
            className="text-xs md:text-sm capitalize my-0
                       text-slate-600 dark:text-slate-200">
            {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
}
