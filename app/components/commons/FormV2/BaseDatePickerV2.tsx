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
        value={value ?? null}
        onChange={onChange}
        disabled={disabled}
        slotProps={{
          textField: {
            placeholder,
            size: "small",
            fullWidth: true,
            variant: "outlined",
            error: !!error,
            sx: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                backgroundColor: "white",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                "&.Mui-disabled": {
                  backgroundColor: "rgb(248, 250, 252)",
                  cursor: "not-allowed",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(203, 213, 225)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary, #172733)",
                  borderWidth: "1px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(203, 213, 225)",
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d32f2f",
                },
                "& .MuiInputAdornment-root": {
                  height: "2.5rem",
                  maxHeight: "2.5rem",
                  marginLeft: "0",
                  "& .MuiButtonBase-root": {
                    padding: "6px",
                  },
                },
              },
              "& .MuiInputBase-input": {
                padding: "0.5rem 0.75rem",
                fontSize: "0.875rem",
                height: "1.5rem",
                "&::placeholder": {
                  color: "rgb(148, 163, 184)",
                  opacity: 1,
                  fontSize: "0.875rem",
                  fontWeight: 400,
                },
                "&:disabled": {
                  backgroundColor: "rgb(248, 250, 252)",
                  cursor: "not-allowed",
                },
              },
              "& .MuiFormControl-root": {
                marginBottom: 0,
              },
              "& input[value='']": {
                color: "rgb(148, 163, 184)",
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                borderRadius: "0.375rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                border: "1px solid rgb(226 232 240)",
              },
            },
          },
        }}
      />
    </div>
  ),
);

BaseDatePickerV2.displayName = "BaseDatePickerV2";

export default BaseDatePickerV2;
