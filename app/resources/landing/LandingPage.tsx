import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import Contact from "@features/Landing/components/Contact";
import { Navbar } from "@features/Landing/components/Navbar";
import Loader from "@resources/components/common/Loader";
import { lazy, Suspense } from "react";

const Experience = lazy(() => import("@features/Landing/components/ExperienceSection"));
const BlogSection = lazy(() => import("./components/BlogSection"));

export default async function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 text-primary dark:text-slate-50">
      <Navbar />
      <div className="w-full lg:w-4/5 lg:w-4xl mx-auto pt-32 contain-layout">
        <Hero />
        <Suspense fallback={<Loader />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <BlogSection />
        </Suspense>

        <Contact />
        <Footer />
      </div>
    </main>
  );
}
