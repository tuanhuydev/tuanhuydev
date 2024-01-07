import { ObjectType } from "@lib/shared/interfaces/base";
import { DatePicker } from "antd";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

export interface DynamicSelectProps extends UseControllerProps<any> {
  options?: ObjectType;
  keyProp?: string;
  className?: string;
}

export default function DynamicDatepicker({
  options,
  keyProp,
  className = "w-full",
  ...restProps
}: DynamicSelectProps) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className="w-full mb-1">
        <DatePicker {...field} {...options} key={keyProp} disabled={isSubmitting} className="w-full" />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
