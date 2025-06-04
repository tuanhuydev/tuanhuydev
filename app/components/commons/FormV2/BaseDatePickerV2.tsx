"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { forwardRef } from "react";

export interface BaseDatePickerV2Props {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  [key: string]: any;
}

export const BaseDatePickerV2 = forwardRef<HTMLDivElement, BaseDatePickerV2Props>(
  ({ value, onChange, className = "", disabled = false, placeholder = "Select date", error, ...restProps }, ref) => (
    <div className={className}>
      <DatePicker
        {...restProps}
        ref={ref}
        value={value || null}
        onChange={onChange}
        disabled={disabled}
        slotProps={{
          textField: {
            placeholder,
            size: "small",
            fullWidth: true,
            error: error,
          },
        }}
      />
    </div>
  ),
);

BaseDatePickerV2.displayName = "BaseDatePickerV2";

export default BaseDatePickerV2;
