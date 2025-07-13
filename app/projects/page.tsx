import { Footer } from "@app/_landing/components/Footer";
import { Navbar } from "@app/_landing/components/Navbar";
import ProjectCard from "@app/components/ProjectModule/ProjectCard";
import ProjectsFilter from "@app/components/ProjectModule/ProjectsFilter";
import { getProjects } from "@server/actions/projectActions";
import React from "react";

const Page = async () => {
  const projects = await getProjects({});

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Navbar />
      <div className="w-full grow lg:w-4/5 lg:max-w-4xl mx-auto pt-32 flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Recent Projects</h2>
        <ProjectsFilter />
        <div
          className="grid gap-6 auto-rows-max mb-12"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        <Footer />
      </div>
    </main>
  );
};

export default Page;
