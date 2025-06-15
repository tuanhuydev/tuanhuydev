import BlogSection from "./components/BlogSection";
import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import { Navbar } from "./components/Navbar";
import Loader from "@app/components/commons/Loader";
import { lazy, Suspense } from "react";
import { getPosts } from "server/actions/blogActions";

const Contact = lazy(() => import("./components/Contact"));
const Experience = lazy(() => import("./components/experience"));

export default async function LandingPage() {
  let posts: Post[] = [];
  try {
    posts = await getPosts({ page: 1, pageSize: 5, published: true });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 text-primary dark:text-slate-50">
      <Navbar />
      <div className="w-full lg:w-4/5 lg:w-4xl mx-auto pt-32 contain-layout">
        <Hero />
        <Suspense fallback={<Loader />}>
          <Experience />
        </Suspense>
        <BlogSection posts={posts} />
        <Suspense fallback={<Loader />}>
          <Contact />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
