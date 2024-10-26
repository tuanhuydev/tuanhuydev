"use client";

import { Option as BaseOption } from "@mui/base/Option";
import { Select } from "@mui/base/Select";
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

const listboxClasses = {
  className:
    "bg-white dark:bg-slate-800 p-0 border-solid border border-slate-300 dark:border-slate-600 p-2 m-0 mt-2 rounded-md",
};

const popupClasses = {
  className: "z-[1300]",
};

const getSelectStyles = (value: any) => {
  const selectStyles = `font-sans py-2 px-3 rounded-md flex items-center border-solid border outline-1 border-slate-300 bg-white dark:bg-slate-800 text-primary dark:text-slate-50 disabled:bg-slate-200 disabled:cursor-not-allowed`;
  const className = value ? `${selectStyles} text-slate-800` : `${selectStyles} text-slate-400`;
  return { className };
};

const baseOptionStyles = {
  className: "flex items-center px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer text-sm",
};

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
  const { options: staticOptions = [], defaultOption, mode = "single", ...restFieldOptions } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);

  return (
    <div className={`self-stretch ${className}`}>
      <div className="mb-1">
        <Select
          {...restFieldOptions}
          defaultValue={value}
          className="w-full font-sans"
          multiple={mode === "multiple"}
          renderValue={(value: any) => {
            if (Array.isArray(value)) {
              return value.length ? (
                value.map(({ label }: SelectOption) => label).join(", ")
              ) : (
                <span className="text-sm text-slate-400 font-normal">Select...</span>
              );
            }
            return value?.label || <span className="text-sm text-slate-400 font-normal">Select...</span>;
          }}
          key={keyProp}
          disabled={isSubmitting}
          onChange={(e: any, value: any) => onChange(value)}
          slotProps={{
            root: getSelectStyles(value),
            listbox: listboxClasses,
            popup: popupClasses,
          }}>
          {options.map((option: SelectOption) => (
            <BaseOption
              key={option.value}
              value={option.value}
              slotProps={{
                root: baseOptionStyles,
              }}>
              {option.label}
            </BaseOption>
          ))}
        </Select>
      </div>
      {error && <div className="text-xs font-light text-red-500 capitalize">{error}</div>}
    </div>
  );
}
