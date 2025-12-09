"use client";

import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@resources/components/common/Select";
import { memo, useEffect, useState } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options?: {
    options?: SelectOption[];
    defaultOption?: SelectOption;
    mode?: "single" | "multiple";
    [key: string]: any;
  };
  keyProp: string;
  className?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  isSubmitting?: boolean;
  placeholder?: string;
  [key: string]: any;
}

const Select = memo(function Select({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  value,
  onChange,
  error,
  isSubmitting,
  placeholder = "Select...",
  ...restProps
}: SelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { options: staticOptions = [], defaultOption, mode = "single", ...restFieldOptions } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);

  const isMultiple = mode === "multiple";

  // Note: shadcn/ui Select doesn't support multiple mode natively
  // For now, we'll handle single selection only
  if (isMultiple) {
    console.warn(
      "Multiple selection mode is not fully supported with shadcn/ui Select. Consider using a Combobox component.",
    );
  }

  const handleValueChange = (selectedValue: string) => {
    if (isMultiple) {
      // For multiple mode, we'd need to implement custom logic
      // For now, treating as single selection
      const selectedOption = options.find((opt) => String(opt.value) === selectedValue);
      onChange(selectedOption?.value);
    } else {
      onChange(selectedValue);
    }
  };

  const currentValue = isMultiple
    ? Array.isArray(value)
      ? value[0]
        ? String(value[0])
        : undefined
      : undefined
    : value
    ? String(value)
    : undefined;

  return (
    <div key={keyProp} className={`self-stretch ${className}`}>
      <div className="mb-1">
        <BaseSelect
          {...restFieldOptions}
          {...restProps}
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={isSubmitting}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: SelectOption) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </BaseSelect>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 mx-3.5">{error}</p>}
    </div>
  );
});

export default Select;
