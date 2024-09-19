"use client";

import { BaseDatePicker } from "../Inputs/BaseDatePicker";
import { forwardRef, Ref } from "react";
import { useController, UseControllerProps } from "react-hook-form";

export interface DynamicDatePickerProps extends UseControllerProps<any> {
  options?: {
    placeholder?: string;
  };
  keyProp?: string;
  className?: string;
  validate?: ObjectType;
}

export const DynamicDatePicker = forwardRef(
  ({ options, keyProp, className, ...restProps }: DynamicDatePickerProps, ref: Ref<HTMLInputElement>) => {
    const { field, fieldState, formState } = useController(restProps);

    const { isSubmitting } = formState;
    const { invalid, error } = fieldState;
    const { onChange, ...restField } = field;

    const handleChange = (date: Date | null) => onChange(date);

    return (
      <div className={`p-2 self-stretch ${className}`}>
        <div className="mb-1">
          <BaseDatePicker inputRef={ref} key={keyProp} disabled={isSubmitting} onChange={handleChange} {...restField} />
        </div>
        {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
      </div>
    );
  },
);
DynamicDatePicker.displayName = "DynamicDatePicker";
