"use client";

import Select from "./Fields/Select";
import { useEffect, useState, memo } from "react";
import { useController } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface DynamicSelectProps {
  options?: {
    options?: SelectOption[];
    defaultOption?: SelectOption;
    mode?: "single" | "multiple";
    placeholder?: string;
    [key: string]: any;
  };
  keyProp: string;
  className?: string;
  control: any;
  name: string;
  [key: string]: any;
}

const DynamicSelect = memo(function DynamicSelect({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  ...restProps
}: DynamicSelectProps) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange } = field;

  const [options, setOptions] = useState<SelectOption[]>([]);
  const { options: staticOptions = [], defaultOption, placeholder = "Select..." } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);

  return (
    <div className={`p-2 self-stretch ${className}`}>
      <Select
        keyProp={keyProp}
        value={field.value}
        onChange={onChange}
        options={{
          ...fieldOptions,
          options,
        }}
        error={invalid ? error?.message : undefined}
        isSubmitting={isSubmitting}
        placeholder={placeholder}
        {...restProps}
      />
    </div>
  );
});

export default DynamicSelect;
