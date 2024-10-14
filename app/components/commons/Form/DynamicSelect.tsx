"use client";

import { Option as BaseOption } from "@mui/base/Option";
import { Select as BaseSelect } from "@mui/base/Select";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

const listboxClasses = {
  className: "bg-white p-0 border-solid border border-slate-300 p-2 m-0 mt-2 rounded-md",
};

const popupClasses = {
  className: "z-[1300]",
};

const getSelectStyles = (value: any) => {
  const selectStyles = `font-sans py-2 px-3 rounded-md flex items-center border-solid border outline-1 border-slate-300 bg-white disabled:bg-slate-200 disabled:cursor-not-allowed`;
  const className = value ? `${selectStyles} text-slate-800` : `${selectStyles} text-slate-400`;
  return { className };
};

const baseOptionStyles = {
  className: "flex items-center px-3 py-2 rounded-md hover:bg-slate-100 cursor-pointer text-sm",
};
export default function DynamicSelect1({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  ...restProps
}: any) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange, ref } = field;

  const [options, setOptions] = useState<SelectOption[]>([]);
  const { options: staticOptions = [], defaultOption, mode = "single", ...restFieldOptions } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);
  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className=" mb-1">
        <BaseSelect
          {...restFieldOptions}
          size="small"
          defaultValue={field.value}
          className="w-full font-sans"
          multiple={mode === "multiple"}
          renderValue={(value: any) => {
            const isArrayValue = Array.isArray(value);
            if (isArrayValue) {
              return (value as Array<SelectOption>).length ? (
                value.map(({ label }: SelectOption) => label).join(", ")
              ) : (
                <span className="text-slate-400">Select...</span>
              );
            }
            if (!value) return <span className="text-slate-400">Select...</span>;
            return value.label;
          }}
          key={keyProp}
          disabled={isSubmitting}
          onChange={(e: any, value: any) => {
            onChange(value);
          }}
          ref={ref}
          slotProps={{
            root: getSelectStyles(field.value),
            listbox: listboxClasses,
            popup: popupClasses,
          }}>
          {options.map((option: any) => (
            <BaseOption
              key={option.value}
              value={option.value}
              slotProps={{
                root: baseOptionStyles,
              }}>
              {option.label}
            </BaseOption>
          ))}
        </BaseSelect>
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
