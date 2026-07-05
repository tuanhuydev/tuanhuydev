"use client";

import { Badge } from "./Badge";
import styles from "./MultiSelect.module.css";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import clsx from "clsx";
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
      <div className={clsx(styles.wrapper, className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={ref}
              type="button"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={clsx(styles.trigger, !selected.length && styles.triggerEmpty, error && styles.triggerError)}>
              <div className={styles.badgeRow}>
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary" className={styles.badge}>
                      {option.label}
                      <button
                        type="button"
                        className={styles.removeButton}
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
                        <X className={styles.removeIcon} />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className={styles.placeholder}>{placeholder}</span>
                )}
              </div>
              <ChevronDown className={styles.chevron} />
            </button>
          </PopoverTrigger>
          <PopoverContent className={styles.popoverContent} align="start">
            <div className={styles.optionList}>
              {options.length === 0 ? (
                <div className={styles.emptyMessage}>No options available</div>
              ) : (
                options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={clsx(styles.option, isSelected && styles.optionSelected)}
                      onClick={() => handleSelect(option.value)}>
                      <div className={styles.optionInner}>
                        <div
                          className={clsx(
                            styles.checkbox,
                            isSelected ? styles.checkboxChecked : styles.checkboxUnchecked,
                          )}>
                          <Check className={styles.checkIcon} />
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
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
