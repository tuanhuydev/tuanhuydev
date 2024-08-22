import Loader from "@app/components/commons/Loader";
import dynamic from "next/dynamic";

const HighlightPost = dynamic(() => import("./HighlightPost"), { loading: () => <Loader /> });

export default async function BlogSection({ posts }: { posts: ObjectType[] }) {
  const makeColumn = (index: number) => {
    const firstItemIndex = 0;
    return index === firstItemIndex ? "lg:row-span-4" : "lg:row-span-3";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-homePosts lg:grid-cols-homePosts gap-y-6 gap-x-4 p-3 grid-flow-row">
        {posts.map((post: ObjectType, index: number) => (
          <HighlightPost key={post.title} post={post} className={makeColumn(index)} />
        ))}
      </div>
    </section>
  );
}
