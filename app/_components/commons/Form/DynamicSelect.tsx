"use client";

import Loader from "../Loader";
import { set } from "date-fns";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";

const Select = dynamic(() => import("antd/es/select"), { ssr: false, loading: () => <Loader /> });

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
  const { options: staticOptions = [], remote, defaultOption, mode = "single", ...restSelectOptions } = selectOptions;

  const [options, setOptions] = useState<SelectOption[]>(staticOptions);

  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange, ref, ...restField } = field;

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
    if (remote) {
      fetchOptions().then((fetchedOptions) => {
        setOptions(defaultOption ? [defaultOption, ...fetchedOptions] : fetchedOptions);
      });
    } else {
      setOptions(defaultOption ? [defaultOption, ...staticOptions] : staticOptions);
    }
  }, [fetchOptions, remote, defaultOption, staticOptions]);

  const handleChange = (newOptions: unknown) => {
    if (mode === "multiple") {
      const isStringArray = (newOptions as SelectOption[]).every((option) => typeof option === "string");
      if (isStringArray) {
        let objectOptions = [];
        for (let option of newOptions as SelectOption[]) {
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
          defaultActiveFirstOption={true}
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
