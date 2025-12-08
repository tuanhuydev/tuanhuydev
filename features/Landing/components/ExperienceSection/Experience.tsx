"use client";

import { Delight } from "./Delight";
import { motion } from "framer-motion";

const tags = [
  "Scalable Frontends",
  "ReactJS/Next.js",
  "Javascript/TypeScript",
  "System Design",
  "Performance Optimization",
  "CI/CD Pipelines",
  "Team Leadership",
  "Node/Golang",
  "AWS",
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-16 text-center contain-layout">
      {/* Title & Description */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-base font-semibold md:text-3xl lg:text-4xl mb-3 bg-gradient-to-r 
                   from-slate-800 to-blue-600 dark:from-slate-100 dark:to-slate-400 
                   bg-clip-text text-transparent will-change-auto">
        Building High-Performance Enterprise Applications
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed
                   text-gray-600 dark:text-gray-300 will-change-auto">
        I design and develop scalable, high-impact applications with strong attention to performance, maintainability,
        and business value.
      </motion.p>

      <div className="relative flex flex-col items-center gap-6 contain-style">
        <ul
          className="grid gap-x-8 gap-y-3 justify-center text-sm font-medium 
                     grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 list-none p-0
                     text-slate-700 dark:text-white">
          {tags.map((tag, i) => (
            <motion.li
              key={tag}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
              className="px-3 py-1 whitespace-nowrap rounded-full border
                         bg-slate-100 dark:bg-slate-800 
                         border-slate-300 dark:border-slate-600
                         transition-all duration-200 ease-out
                         hover:bg-slate-200 dark:hover:bg-slate-700 
                         cursor-pointer text-center will-change-auto landing-experience-tag-shadow">
              {tag}
            </motion.li>
          ))}
        </ul>
      </div>

      <div
        className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 justify-items-center 
                   max-w-xl mx-auto overflow-hidden contain-style">
        <Delight title="Projects" value={10} gradient={{ from: "from-cyan-500", to: "to-cyan-900" }} />

        <Delight title="Companies" value={3} gradient={{ from: "from-rose-500", to: "to-rose-900" }} />

        <div className="col-span-2 lg:col-span-1 flex justify-center">
          <Delight title="Experiences" value={4} gradient={{ from: "from-indigo-500", to: "to-indigo-900" }} />
        </div>
      </div>
    </section>
  );
}
