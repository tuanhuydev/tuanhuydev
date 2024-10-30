"use client";

import BaseSelect from "../Inputs/BaseSelect";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

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
      <div className="mb-1">
        <BaseSelect
          keyProp={keyProp}
          value={field.value}
          onChange={onChange}
          options={fieldOptions}
          error={error?.message}
          isSubmitting={isSubmitting}
          {...restProps}
        />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
