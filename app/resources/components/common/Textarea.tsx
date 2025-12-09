import { cn } from "@resources/utils/helper";
import * as React from "react";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Layout
          "flex min-h-[60px] w-full",
          // Border & Radius
          "rounded-md border border-slate-300 dark:border-slate-600",
          // Background
          "bg-white dark:bg-slate-800",
          // Text
          "text-base text-gray-900 dark:text-gray-100 md:text-sm",
          // Placeholder
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          // Padding & Shadow
          "px-3 py-2 shadow-sm",
          // Hover State
          "hover:border-slate-400 dark:hover:border-slate-500",
          // Focus State
          "outline-none focus:border-primary dark:focus:border-slate-500",
          // Transitions
          "transition-colors duration-200",
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
Textarea.displayName = "Textarea";

export { Textarea };
