"use client";

import { Button } from "@resources/components/common/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@resources/components/common/Popover";
import { Calendar } from "@resources/components/common/calendar";
import { cn } from "@resources/utils/helper";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { forwardRef } from "react";

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  inputRef?: React.Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    { value, onChange, className = "", disabled = false, placeholder = "Select date", error, inputRef, ...restProps },
    ref,
  ) => {
    return (
      <div ref={ref} className={className as string}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              ref={inputRef as React.Ref<HTMLButtonElement>}
              variant="outline"
              className={cn(
                // Layout
                "h-9 w-full justify-start text-left font-normal",
                // Border
                "border-slate-300 dark:border-slate-600",
                // Background - match Input component
                "bg-white dark:bg-slate-800",
                // Text
                "text-base text-gray-900 dark:text-gray-100 md:text-sm",
                // Placeholder state
                !value && "text-slate-400 dark:text-slate-500",
                // Focus State
                "focus:border-primary dark:focus:border-slate-500",
                // Error state
                (error as boolean) && "border-red-500 focus-visible:ring-red-500",
                // Hover
                "hover:border-slate-400 dark:hover:border-slate-500",
              )}
              disabled={disabled as boolean}
              {...restProps}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value as Date, "PPP") : <span>{(placeholder as string) ?? ""}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={(value as Date) || undefined}
              onSelect={onChange as (date: Date) => void}
              disabled={disabled as boolean}
              required
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
