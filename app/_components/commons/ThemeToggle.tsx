"use client";

import { useTheme } from "@app/_utils/useTheme";
import { motion } from "framer-motion";

export interface ThemeToggleProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle = ({ size = "md", className = "", showLabel = false }: ThemeToggleProps) => {
  const { darkMode, toggleTheme, isLoading } = useTheme();

  const buttonClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const svgClasses = {
    sm: "w-5 h-5",
    md: "w-5 h-5",
    lg: "w-5 h-5",
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${buttonClasses[size]} ${svgClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        className={`
          rounded-full shadow-lg border-none bg-transparent flex 
          dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
          transition-colors duration-200
          ${buttonClasses[size]} ${className}
        `}>
        {darkMode ? (
          <motion.svg
            key="sun-icon"
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 0.5 }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={`fill-primary dark:fill-slate-50 ${svgClasses[size]}`}
            xmlns="http://www.w3.org/2000/svg">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM3.66865 3.71609C3.94815 3.41039 4.42255 3.38915 4.72825 3.66865L6.95026 5.70024C7.25596 5.97974 7.2772 6.45413 6.9977 6.75983C6.7182 7.06553 6.2438 7.08677 5.9381 6.80727L3.71609 4.77569C3.41039 4.49619 3.38915 4.02179 3.66865 3.71609ZM20.3314 3.71609C20.6109 4.02179 20.5896 4.49619 20.2839 4.77569L18.0619 6.80727C17.7562 7.08677 17.2818 7.06553 17.0023 6.75983C16.7228 6.45413 16.744 5.97974 17.0497 5.70024L19.2718 3.66865C19.5775 3.38915 20.0518 3.41039 20.3314 3.71609ZM12 7.75C9.65279 7.75 7.75 9.65279 7.75 12C7.75 14.3472 9.65279 16.25 12 16.25C14.3472 16.25 16.25 14.3472 16.25 12C16.25 9.65279 14.3472 7.75 12 7.75ZM6.25 12C6.25 8.82436 8.82436 6.25 12 6.25C15.1756 6.25 17.75 8.82436 17.75 12C17.75 15.1756 15.1756 17.75 12 17.75C8.82436 17.75 6.25 15.1756 6.25 12ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM17.0255 17.0252C17.3184 16.7323 17.7933 16.7323 18.0862 17.0252L20.3082 19.2475C20.6011 19.5404 20.601 20.0153 20.3081 20.3082C20.0152 20.6011 19.5403 20.601 19.2475 20.3081L17.0255 18.0858C16.7326 17.7929 16.7326 17.3181 17.0255 17.0252ZM6.97467 17.0253C7.26756 17.3182 7.26756 17.7931 6.97467 18.086L4.75244 20.3082C4.45955 20.6011 3.98468 20.6011 3.69178 20.3082C3.39889 20.0153 3.39889 19.5404 3.69178 19.2476L5.91401 17.0253C6.2069 16.7324 6.68177 16.7324 6.97467 17.0253ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon-icon"
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 0.5 }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={`fill-primary dark:fill-slate-50 ${svgClasses[size]}`}
            xmlns="http://www.w3.org/2000/svg">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C16.7767 21.25 20.7078 17.6293 21.1984 12.9826C19.8717 14.6669 17.8126 15.75 15.5 15.75C11.4959 15.75 8.25 12.5041 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C12.7166 1.25 13.0754 1.82126 13.1368 2.27627C13.196 2.71398 13.0342 3.27065 12.531 3.57467C10.8627 4.5828 9.75 6.41182 9.75 8.5C9.75 11.6756 12.3244 14.25 15.5 14.25C17.5882 14.25 19.4172 13.1373 20.4253 11.469C20.7293 10.9658 21.286 10.804 21.7237 10.8632C22.1787 10.9246 22.75 11.2834 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"
            />
          </motion.svg>
        )}
      </button>
      {showLabel && <span className="text-sm text-gray-600 dark:text-gray-300">{darkMode ? "Dark" : "Light"}</span>}
    </div>
  );
};
