import { cn } from "@resources/utils/helper";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout
          "flex h-9 w-full",
          // Border & Radius
          "rounded-md border border-slate-300 dark:border-slate-600",
          // Background
          "bg-white dark:bg-slate-800",
          // Text
          "text-base text-gray-900 dark:text-gray-100 md:text-sm",
          // Placeholder
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          // Padding & Shadow
          "px-3 py-1 shadow-sm",
          // Hover State
          "hover:border-slate-400 dark:hover:border-slate-500",
          // Focus State
          "outline-none focus:border-primary dark:focus:border-slate-500",
          // Transitions
          "transition-colors duration-200",
          // File Input Styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Disabled State
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
