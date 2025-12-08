import { DatePicker } from "@mui/x-date-pickers";
import { forwardRef, Ref } from "react";

export const BaseDatePicker: React.FC<any> = forwardRef(
  ({ value, onChange, className = "", disabled = false, ...restProps }, ref: Ref<HTMLDivElement>) => (
    <div className={className}>
      <DatePicker
        {...restProps}
        ref={ref}
        slotProps={{
          textField: {
            placeholder: "Select date",
            size: "small",
            fullWidth: true,
            variant: "outlined",
            InputProps: {
              sx: {
                borderColor: "var(--slate-400)",
                "::placeholder": {
                  color: "var(--slate-400)",
                },
                "MuiInputBase-input MuiOutlinedInput-input": {
                  "::placeholder": {
                    color: "var(--slate-400)",
                  },
                },
              },
            },
            InputLabelProps: {
              shrink: false,
              classes: {
                root: "text-sm ::disabled:bg-red-400 outline-none border-none bg-transparent placeholder:text-slate-400 border-slate-400",
              },
            },
          },
        }}
        disableOpenPicker={disabled}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
);

BaseDatePicker.displayName = "BaseDatePicker";
