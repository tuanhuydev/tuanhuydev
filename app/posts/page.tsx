import PostsGrid from "../resources/components/features/Post/PostsGrid";
import { Navbar } from "@features/Landing/components/Navbar";
import BentoGrid from "@resources/components/features/Post/BentoGrid";
import { Footer } from "@resources/landing/components/Footer";
import { getPosts } from "@server/actions/blogActions";
import React from "react";

export const dynamic = "force-dynamic"; // Force dynamic rendering for this page
export const revalidate = 3600; // Revalidate every hour
const Page = async () => {
  const posts = await getPosts({ published: true, sortBy: "publishedAt", sortOrder: "desc" });

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Navbar />
      <div className="w-full grow lg:w-4/5 lg:w-4xl mx-auto pt-32 flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Recent Posts</h2>

        {/* Feature Posts Bento Grid */}
        {posts && posts.length > 0 && (
          <div className="mb-12">
            <BentoGrid featurePosts={posts.slice(0, 3)} className="mb-8" />
          </div>
        )}

        {/* Rest of Posts in Masonry Grid */}
        {posts && posts.length > 3 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">More Posts</h2>
            <PostsGrid posts={posts.slice(3)} />
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
};

export default Page;
