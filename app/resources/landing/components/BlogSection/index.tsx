import { PostItem } from "@resources/components/features/Post/PostItem";
import { getPosts } from "server/actions/blogActions";

const FIRST_ITEM_CLASS = "col-span-full md:col-span-1 lg:col-span-2 lg:row-span-4";
const OTHER_ITEM_CLASS = "col-span-full md:col-span-1 lg:col-span-2 lg:row-span-3";

const getColumnClass = (index: number): string => {
  return index === 0 ? FIRST_ITEM_CLASS : OTHER_ITEM_CLASS;
};

export default async function BlogSection() {
  let posts: Post[] = [];
  try {
    posts = await getPosts({ page: 1, pageSize: 5, published: true });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  if (!posts.length) {
    return (
      <section id="blog" className="flex flex-col items-center contain-layout">
        <p className="text-gray-600 dark:text-gray-300">No posts available</p>
      </section>
    );
  }

  return (
    <section id="blog" className="flex flex-col items-center contain-layout">
      <h2
        className="text-xl font-semibold md:text-3xl lg:text-4xl mb-3 bg-gradient-to-r 
                   from-slate-800 to-amber-600 dark:from-slate-100 dark:to-slate-400 
                   bg-clip-text text-transparent will-change-auto 
                   animate-fadeIn">
        Learning is a long journey
      </h2>
      <p
        className="mt-4 text-base md:text-lg text-center lg:text-left max-w-2xl mx-auto 
                   leading-relaxed text-gray-600 dark:text-gray-300 will-change-auto
                   animate-fadeIn delay-200">
        Explore new ideas and expand your understanding through my blog posts.
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-homePosts lg:grid-cols-6 
                   w-3/4 gap-y-6 gap-x-4 p-3 grid-flow-row contain-style">
        {posts.map((post: Post, index: number) => (
          <PostItem post={post} key={post.slug} className={getColumnClass(index)} />
        ))}
      </div>
    </section>
  );
}
