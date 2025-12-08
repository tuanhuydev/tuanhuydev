"use client";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export interface PostItemProps {
  post: ObjectType;
  className?: string;
}

export const PostItem: React.FC<PostItemProps> = ({ post, className }) => {
  const { title, slug, thumbnail = "", createdAt, publishedAt } = post;
  const displayDate = publishedAt || createdAt;

  return (
    <Link
      href={`/posts/${slug}`}
      prefetch
      className={`block rounded-md transition-all duration-300 ease-out cursor-pointer 
                  drop-shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 
                  focus:ring-blue-500/50 will-change-transform ${className ?? ""}`}>
      <div
        className="h-full flex flex-col rounded-md bg-white dark:bg-slate-800 
                   dark:border dark:border-slate-700 p-5 contain-layout 
                   transition-colors duration-200">
        <div className="w-full min-h-[12rem] relative mb-3 overflow-hidden rounded-md">
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
            className="text-base lg:text-xl my-0 mb-1 font-bold capitalize line-clamp-2
                       text-slate-900 dark:text-slate-50">
            {title}
          </h4>
          {displayDate && (
            <p className="text-xs md:text-sm my-0 text-slate-600 dark:text-slate-200">
              {format(new Date(displayDate), "MMM dd, yyyy")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
