"use client";

import { Badge } from "./Badge";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cn } from "@resources/utils/helper";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, value = [], onChange, placeholder = "Select items...", className, disabled, error }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<string[]>(value);

    React.useEffect(() => {
      setSelected(value);
    }, [value]);

    const handleSelect = React.useCallback(
      (optionValue: string) => {
        const newSelected = selected.includes(optionValue)
          ? selected.filter((item) => item !== optionValue)
          : [...selected, optionValue];

        setSelected(newSelected);
        onChange?.(newSelected);
      },
      [selected, onChange],
    );

    const handleRemove = React.useCallback(
      (optionValue: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newSelected = selected.filter((item) => item !== optionValue);
        setSelected(newSelected);
        onChange?.(newSelected);
      },
      [selected, onChange],
    );

    const selectedOptions = React.useMemo(
      () => selected.map((val) => options.find((opt) => opt.value === val)).filter(Boolean) as MultiSelectOption[],
      [selected, options],
    );

    return (
      <div className={cn("w-full", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={ref}
              type="button"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                // Layout - match Select
                "flex h-auto min-h-9 w-full items-center justify-between whitespace-nowrap",
                // Border & Radius - match Select
                "rounded-md border border-slate-300 dark:border-slate-600",
                // Background - match Select
                "bg-white dark:bg-slate-800",
                // Text - match Select
                "text-base text-gray-900 dark:text-gray-100 md:text-sm",
                // Placeholder - match Select
                !selected.length && "text-slate-400 dark:text-slate-500",
                // Padding & Shadow - match Select
                "px-3 py-2 shadow-sm",
                // Hover State - match Select (removed unnecessary hover from button variant)
                "hover:border-slate-400 dark:hover:border-slate-500",
                // Focus State - match Select
                "outline-none focus:border-primary dark:focus:border-slate-500",
                // Transitions - match Select
                "transition-colors duration-200",
                // Disabled State - match Select
                "disabled:cursor-not-allowed disabled:opacity-50",
                // Error state
                error && "border-red-500",
              )}>
              <div className="flex flex-wrap gap-1 flex-1 min-h-5">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="mr-1 mb-1 flex items-center gap-1 px-2 py-0.5">
                      {option.label}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(option.value, e as unknown as React.MouseEvent);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => handleRemove(option.value, e)}>
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="line-clamp-1">{placeholder}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="max-h-64 overflow-auto p-1">
              {options.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No options available</div>
              ) : (
                options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent",
                      )}
                      onClick={() => handleSelect(option.value)}>
                      <div className="flex items-center flex-1">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                          )}>
                          <Check className="h-4 w-4" />
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
        {error && <p className="text-xs text-red-500 mt-1 mx-3.5">{error}</p>}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
