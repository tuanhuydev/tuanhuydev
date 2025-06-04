"use client";

import BaseDatePickerV2 from "./BaseDatePickerV2";
import { FormHelperText } from "@mui/material";
import { forwardRef, memo, Ref } from "react";
import { useController, UseControllerProps } from "react-hook-form";

export interface DynamicDatePickerV2Props extends UseControllerProps<any> {
  options?: {
    placeholder?: string;
    disabled?: boolean;
  };
  keyProp?: string;
  className?: string;
  validate?: Record<string, any>;
}

export const DynamicDatePickerV2 = memo(
  forwardRef<HTMLInputElement, DynamicDatePickerV2Props>(function DynamicDatePickerV2(
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
          <BaseDatePickerV2
            inputRef={ref}
            key={keyProp}
            value={value}
            disabled={isSubmitting || options?.disabled}
            onChange={handleChange}
            placeholder={options?.placeholder || "Select date"}
            error={invalid}
            {...restField}
          />
          {invalid && error?.message && (
            <FormHelperText error={true} sx={{ margin: "0.25rem 0.875rem" }}>
              {error?.message}
            </FormHelperText>
          )}
        </div>
      </div>
    );
  }),
);

DynamicDatePickerV2.displayName = "DynamicDatePickerV2";

export default DynamicDatePickerV2;
