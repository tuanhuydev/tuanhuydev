import Contact from "./components/Contact";
import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import { Navbar } from "./components/Navbar";
import Experience from "./components/experience";
import BlogSection from "@app/components/HomeModule/BlogSection";
import { getPosts } from "server/actions/blogActions";

export default async function LandingPage() {
  let posts: Post[] = [];
  try {
    posts = await getPosts({ page: 1, pageSize: 5, published: true });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Navbar />
      <div className="w-full lg:w-4/5 lg:w-4xl mx-auto pt-32">
        <Hero />
        <Experience />
        <BlogSection posts={posts} />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
