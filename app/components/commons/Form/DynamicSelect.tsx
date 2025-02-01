"use client";

import BaseSelect from "../Inputs/BaseSelect";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

export default function DynamicSelect1({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  ...restProps
}: any) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange } = field;

  const [options, setOptions] = useState<SelectOption[]>([]);
  const { options: staticOptions = [], defaultOption } = fieldOptions;

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
