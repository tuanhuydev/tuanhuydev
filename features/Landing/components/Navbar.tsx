"use client";

import { ThemeToggle } from "@app/components/commons/ThemeToggle";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [showAtBottom, setShowAtBottom] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Scroll handling
  const handleScroll = () => {
    // Handle Scroll down
    const scrollThreshold = 50;
    setShowAtBottom(window.scrollY > scrollThreshold);

    // Handle Scroll Top
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    setShowScrollTop(scrollPercentage > 0.1);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Components
  const Logo = () => (
    <div className="text-primary dark:text-slate-50 font-bold flex items-center">
      <Link href="/" className="line-height-1 hover:underline flex items-center cursor-pointer">
        <svg
          width="32"
          height="32"
          viewBox="0 0 16 16"
          fill="none"
          className="fill-primary dark:fill-slate-50"
          xmlns="http://www.w3.org/2000/svg">
          <motion.path
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d="M2 6.3609V8.31087C2 8.42588 2.06982 8.5301 2.17816 8.57681L6.97816 10.6464C7.17655 10.7319 7.4 10.591 7.4 10.3804V8.98505C7.4 8.86756 7.32718 8.76159 7.21538 8.71641L4.46462 7.60453C4.21846 7.50503 4.21846 7.16674 4.46462 7.06724L7.21538 5.95536C7.32718 5.91017 7.4 5.80421 7.4 5.68672V4.29136C7.4 4.08075 7.17654 3.93988 6.97816 4.02541L2.17816 6.09495C2.06982 6.14166 2 6.24589 2 6.3609Z"
          />
          <motion.path
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.125 }}
            d="M14 10.6391V8.68913C14 8.57412 13.9302 8.4699 13.8218 8.42319L9.02184 6.35364C8.82346 6.26811 8.6 6.40898 8.6 6.61959V8.01495C8.6 8.13244 8.67282 8.23841 8.78462 8.28359L11.5354 9.39547C11.7815 9.49497 11.7815 9.83326 11.5354 9.93276L8.78462 11.0446C8.67282 11.0898 8.6 11.1958 8.6 11.3133V12.7086C8.6 12.9192 8.82346 13.0601 9.02184 12.9746L13.8218 10.905C13.9302 10.8583 14 10.7541 14 10.6391Z"
          />
        </svg>
        {!showAtBottom && <h1 className="inline text-base lg:text-2xl dark:text-slate-50">tuanhuydev</h1>}
      </Link>
    </div>
  );

  const Actions = () => (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {!showAtBottom && (
        <a
          href="#contact"
          className="rounded-full bg-stone-900 shadow-lg dark:bg-slate-50 text-slate-50 dark:text-stone-900 text-xs md:text-base uppercase font-semibold px-4 py-2 md:px-4 cursor-pointer">
          Contact
        </a>
      )}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`p-2 rounded-full shadow-lg cursor-pointer border-none bg-transparent dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}>
          <motion.svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <g>
              <motion.path
                d="M12 20L12 4M12 4L18 10M12 4L6 10"
                className="stroke-stone-900 dark:stroke-slate-50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}></motion.path>
            </g>
          </motion.svg>
        </motion.button>
      )}
    </div>
  );

  return (
    <motion.header
      initial={{ y: -100, x: "-50%" }}
      animate={{ y: 0, x: "-50%" }}
      className={`rounded-full flex justify-between fixed z-10 px-4 lg:px-5 py-2 left-1/2 ${
        showAtBottom ? "bg-slate-50 dark:bg-slate-900 shadow-md" : "bg-transparent"
      } ${showAtBottom ? "bottom-[60px] w-3/5 lg:w-1/5 ease-in" : "top-4 w-full md:w-4/5 xl:w-4xl"}`}>
      <Logo />
      <div className="flex items-center gap-3 lg:gap-8">
        {!showAtBottom && (
          <Link href="/posts" className="text-xs md:text-base hover:underline text-primary dark:text-slate-50">
            Blogs
          </Link>
        )}
        <Actions />
      </div>
    </motion.header>
  );
};
