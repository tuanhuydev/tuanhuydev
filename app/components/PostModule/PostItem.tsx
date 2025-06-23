"use client";

import { formatDate } from "@app/_utils/helper";
import Image from "next/image";

export interface PostsGridProps {
  posts: ObjectType[];
  className?: string;
}

export const PostItem: React.FC<{ post: ObjectType }> = ({ post }) => {
  const { title, slug, thumbnail, publishedAt, createdAt } = post;
  const displayDate = publishedAt ? formatDate(publishedAt) : createdAt ? formatDate(createdAt) : "";

  return (
    <a
      href={`/posts/${slug}`}
      className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-transparent"></div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-thin m-0">{displayDate}</p>
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 line-clamp-2 group-hover:text-primary dark:group-hover:text-white transition-colors m-0">
          {title}
        </h3>
      </div>
    </a>
  );
};
