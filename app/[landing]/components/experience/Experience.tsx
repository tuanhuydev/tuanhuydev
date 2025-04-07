"use client";

import { Delight, DelightProps } from "./Delight";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const delights = [
  {
    title: "projects",
    value: 10,
    gradient: {
      from: "from-cyan-500",
      to: "to-cyan-900",
    },
  },
  {
    title: "companies",
    value: 3,
    gradient: {
      from: "from-rose-500",
      to: "to-rose-900",
    },
  },
  {
    title: "experiences",
    value: 4,
    gradient: {
      from: "from-indigo-500",
      to: "to-indigo-900",
    },
  },
];
export default function Experience() {
  return (
    <section className="relative py-8 lg:py-16 text-center">
      {/* Heading */}
      <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent from-slate-700 to-primary dark:from-slate-100 dark:to-slate-400">
        Elevating Excellence in Every Project
      </h2>
      <p className="mt-3 text-gray-600 text-sm lg:text-xl font-medium">
        I consistently deliver quality and innovation, setting new standards for success.
      </p>

      {/* Stats Section */}
      <div className="mt-10 flex justify-center gap-3 lg:gap-12 flex-wrap">
        {delights.map((delight: DelightProps) => (
          <Delight key={delight.title} {...delight} />
        ))}
      </div>
    </section>
  );
}

// Animated Counter Component
function AnimatedStat({ label, value, color }: { label: string; value: number; color: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1500; // 1.5 seconds
    const incrementTime = Math.floor(duration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <p className={`text-lg font-medium ${color}`}>&lt;{label} /&gt;</p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl font-bold text-gray-900">
        {count}+
      </motion.p>
    </div>
  );
}
