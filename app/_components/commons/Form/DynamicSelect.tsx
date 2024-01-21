"use client";

import { Select } from "antd";
import Cookies from "js-cookie";
import React, { useCallback, useEffect, useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";

export interface DynamicSelectProps extends UseControllerProps<any> {
  options?: ObjectType;
  keyProp?: string;
  className?: string;
}

export default function DynamicSelect({
  options: selectOptions = {},
  keyProp,
  className = "w-full",
  ...restProps
}: DynamicSelectProps) {
  const { options: staticOptions = [], remote, mode = "single", ...restSelectOptions } = selectOptions;

  const [options, setOptions] = useState<SelectOption[]>(staticOptions);

  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange, ...restField } = field;

  const fetchOptions = useCallback(async () => {
    const { url, label, value } = remote;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    if (!response.ok) return [];

    const { data: options = [] } = await response.json();
    return await options.map((option: ObjectType) => ({ label: option[label], value: option[value] }));
  }, [remote]);

  useEffect(() => {
    if (remote)
      fetchOptions().then((options) => {
        setOptions(options);
      });
  }, [fetchOptions, remote]);

  const handleChange = (newOptions: any[]) => {
    if (mode === "multiple") {
      const isStringArray = newOptions.every((option) => typeof option === "string");
      if (isStringArray) {
        let objectOptions = [];
        for (let option of newOptions) {
          const foundOption = options.find(({ value }: ObjectType) => value === option);
          if (foundOption) objectOptions.push(foundOption);
        }
        return onChange(objectOptions);
      }
      return onChange(newOptions);
    }
    return onChange(newOptions);
  };

  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className=" mb-1">
        <Select
          key={keyProp}
          {...restField}
          {...restSelectOptions}
          onChange={handleChange}
          mode={mode}
          options={options}
          className="w-full"
          disabled={isSubmitting}
        />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
