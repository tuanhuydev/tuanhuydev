"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { useEffect, useState } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface DynamicSelectProps {
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
  [key: string]: any;
}

export default function BaseSelect({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  value,
  onChange,
  error,
  isSubmitting,
  ...restProps
}: DynamicSelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const {
    options: staticOptions = [],
    defaultOption,
    mode = "single",
    placeholder = "Select...",
    ...restFieldOptions
  } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);

  // Note: shadcn/ui Select doesn't support multiple mode natively
  // For multiple selection, you would need to use a Combobox or implement custom logic
  if (mode === "multiple") {
    console.warn(
      "Multiple selection mode is not supported with shadcn/ui Select. Consider using a different component.",
    );
  }

  const handleValueChange = (selectedValue: string) => {
    const selectedOption = options.find((opt) => String(opt.value) === selectedValue);
    onChange(selectedOption);
  };

  const currentValue = value ? String(value.value || value) : undefined;

  return (
    <div className={`self-stretch ${className}`}>
      <div className="mb-1">
        <Select
          key={keyProp}
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={isSubmitting}
          {...restFieldOptions}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: SelectOption) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-xs font-light text-red-500 capitalize">{error}</div>}
    </div>
  );
}
