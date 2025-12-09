"use client";

import DatePicker from "./Fields/DatePicker";
import { forwardRef, memo, Ref } from "react";
import { useController, UseControllerProps } from "react-hook-form";

export interface DynamicDatePickerProps extends UseControllerProps<any> {
  options?: {
    placeholder?: string;
    disabled?: boolean;
  };
  keyProp?: string;
  className?: string;
  validate?: Record<string, any>;
}

export const DynamicDatePicker = memo(
  forwardRef<HTMLInputElement, DynamicDatePickerProps>(function DynamicDatePicker(
    { options, keyProp, className = "w-full", ...restProps },
    ref: Ref<HTMLInputElement>,
  ) {
    const { field, fieldState, formState } = useController(restProps);

    const { isSubmitting } = formState;
    const { invalid, error } = fieldState;
    const { onChange, value = null, ...restField } = field;

    const handleChange = (date: Date | null) => onChange(date);

    return (
      <div className={`p-2 self-stretch ${className}`}>
        <div className="self-stretch">
          <DatePicker
            inputRef={ref}
            key={keyProp}
            value={value}
            disabled={isSubmitting || options?.disabled}
            onChange={handleChange}
            {...restField}
          />
          {invalid && error?.message && <p className="text-sm text-red-500 mt-1.5 mx-3.5">{error?.message}</p>}
        </div>
      </div>
    );
  }),
);

DynamicDatePicker.displayName = "DynamicDatePicker";

export default DynamicDatePicker;
