import formatDistance from "date-fns/formatDistance";
import Image from "next/image";
import Link from "next/link";

export interface HighlightPostProps {
  post: ObjectType;
  className?: string;
}

export default async function HighlightPost({ post, className }: HighlightPostProps) {
  const { title, thumbnail = "", createdAt } = post;
  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch
      className={`col-span-full md:col-span-1 lg:col-span-2 rounded-md transition-all drop-shadow duration-150 hover:drop-shadow-md ease-in-out cursor-pointer ${className}`}>
      <div className="z-0 h-full flex flex-col rounded-md relative bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-5">
        <div className="w-full min-h-[12rem] grow relative mb-2 overflow-hidden rounded-md">
          {thumbnail && (
            <Image
              src={thumbnail}
              className="object-cover transition-all duration-500 hover:scale-105"
              alt={title}
              fill
              sizes="50vw"
            />
          )}
        </div>
        <div className="mt-auto">
          <h4 className="text-slate-900 dark:text-slate-50 text-base lg:text-2xl my-0 mb-1 font-bold capitalize line-clamp-2">
            {title}
          </h4>
          <p className="text-slate-600 dark:text-slate-200 text-xs md:text-sm capitalize my-0">
            {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
}
