import Loader from "../Loader";
import dynamic from "next/dynamic";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

const DatePicker = dynamic(() => import("antd/es/date-picker"), { ssr: false, loading: () => <Loader /> });

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
  const { ref, ...restField } = field;
  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className="w-full mb-1">
        <DatePicker
          {...restField}
          {...options}
          key={keyProp}
          disabled={isSubmitting}
          value={field.value as any}
          className="w-full"
          format="YYYY/MM/DD"
        />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
