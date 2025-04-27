"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAtBottom, setShowAtBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Theme management
  const initializeTheme = () => {
    const savedTheme = localStorage.theme;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.theme = newDarkMode ? "dark" : "light";
  };

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
    initializeTheme();
  }, []);

  useEffect(() => {
    if (window !== undefined) {
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
      <button
        onClick={toggleTheme}
        className={`${
          showAtBottom ? "p-1" : "p-2"
        } rounded-full shadow-lg border-none bg-transparent flex dark:bg-slate-800`}>
        {darkMode ? (
          <motion.svg
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            className={`fill-primary dark:fill-slate-50 w-5 lg:w-5 h-5 lg:h-5`}
            xmlns="http://www.w3.org/2000/svg">
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM3.66865 3.71609C3.94815 3.41039 4.42255 3.38915 4.72825 3.66865L6.95026 5.70024C7.25596 5.97974 7.2772 6.45413 6.9977 6.75983C6.7182 7.06553 6.2438 7.08677 5.9381 6.80727L3.71609 4.77569C3.41039 4.49619 3.38915 4.02179 3.66865 3.71609ZM20.3314 3.71609C20.6109 4.02179 20.5896 4.49619 20.2839 4.77569L18.0619 6.80727C17.7562 7.08677 17.2818 7.06553 17.0023 6.75983C16.7228 6.45413 16.744 5.97974 17.0497 5.70024L19.2718 3.66865C19.5775 3.38915 20.0518 3.41039 20.3314 3.71609ZM12 7.75C9.65279 7.75 7.75 9.65279 7.75 12C7.75 14.3472 9.65279 16.25 12 16.25C14.3472 16.25 16.25 14.3472 16.25 12C16.25 9.65279 14.3472 7.75 12 7.75ZM6.25 12C6.25 8.82436 8.82436 6.25 12 6.25C15.1756 6.25 17.75 8.82436 17.75 12C17.75 15.1756 15.1756 17.75 12 17.75C8.82436 17.75 6.25 15.1756 6.25 12ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM17.0255 17.0252C17.3184 16.7323 17.7933 16.7323 18.0862 17.0252L20.3082 19.2475C20.6011 19.5404 20.601 20.0153 20.3081 20.3082C20.0152 20.6011 19.5403 20.601 19.2475 20.3081L17.0255 18.0858C16.7326 17.7929 16.7326 17.3181 17.0255 17.0252ZM6.97467 17.0253C7.26756 17.3182 7.26756 17.7931 6.97467 18.086L4.75244 20.3082C4.45955 20.6011 3.98468 20.6011 3.69178 20.3082C3.39889 20.0153 3.39889 19.5404 3.69178 19.2476L5.91401 17.0253C6.2069 16.7324 6.68177 16.7324 6.97467 17.0253ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z"
                className={`fill-primary dark:fill-slate-50`}></motion.path>
            </g>
          </motion.svg>
        ) : (
          <motion.svg
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            viewBox="0 0 24 24"
            className={`fill-primary dark:fill-slate-50 w-4 lg:w-6 h-4 lg:h-6`}
            xmlns="http://www.w3.org/2000/svg">
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C16.7767 21.25 20.7078 17.6293 21.1984 12.9826C19.8717 14.6669 17.8126 15.75 15.5 15.75C11.4959 15.75 8.25 12.5041 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C12.7166 1.25 13.0754 1.82126 13.1368 2.27627C13.196 2.71398 13.0342 3.27065 12.531 3.57467C10.8627 4.5828 9.75 6.41182 9.75 8.5C9.75 11.6756 12.3244 14.25 15.5 14.25C17.5882 14.25 19.4172 13.1373 20.4253 11.469C20.7293 10.9658 21.286 10.804 21.7237 10.8632C22.1787 10.9246 22.75 11.2834 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"
                className={`fill-primary dark:fill-slate-50`}></motion.path>
            </g>
          </motion.svg>
        )}
      </button>
      {!showAtBottom && (
        <a
          href="#contact"
          className="rounded-full bg-stone-900 shadow-lg dark:bg-slate-50 dark:!text-primary !text-slate-50 text-xs md:text-base uppercase font-semibold px-4 py-2 md:px-4 cursor-pointer">
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
          className={`${
            showAtBottom ? "p-1" : "p-2"
          } rounded-full shadow-lg cursor-pointer border-none bg-transparent dark:bg-slate-800`}>
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 lg:w-5 h-4 lg:h-5`}>
            <g>
              <motion.path
                d="M12 20L12 4M12 4L18 10M12 4L6 10"
                className="stroke-primary dark:stroke-slate-50"
                strokeWidth="1.5"
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
      } ${showAtBottom ? "bottom-[60px] w-3/5 lg:w-1/5 ease-in" : "top-4 w-5/6 md:w-4/5 lg:w-4xl"}`}>
      <Logo />
      <Actions />
    </motion.header>
  );
};
