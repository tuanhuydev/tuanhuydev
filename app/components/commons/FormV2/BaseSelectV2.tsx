"use client";

import {
  FormControl,
  Select,
  MenuItem,
  Chip,
  SelectProps,
  InputLabel,
  OutlinedInput,
  Box,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState, memo } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface BaseSelectV2Props extends Omit<SelectProps, "onChange" | "error"> {
  options?: {
    options?: SelectOption[];
    defaultOption?: SelectOption;
    mode?: "single" | "multiple";
    [key: string]: any;
  };
  keyProp: string;
  className?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  isSubmitting?: boolean;
  placeholder?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const BaseSelectV2 = memo(function BaseSelectV2({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  value,
  onChange,
  error,
  isSubmitting,
  placeholder = "Select...",
  ...restProps
}: BaseSelectV2Props) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { options: staticOptions = [], defaultOption, mode = "single", ...restFieldOptions } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);

  const isMultiple = mode === "multiple";
  const displayValue = Array.isArray(value) ? value : value ? [value] : [];

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    if (isMultiple) {
      onChange(selectedValue);
    } else {
      onChange(selectedValue);
    }
  };

  const renderValue = (selected: any) => {
    if (isMultiple && Array.isArray(selected)) {
      if (selected.length === 0) {
        return <span style={{ color: "rgb(148, 163, 184)" }}>{placeholder}</span>;
      }
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((val: any) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                size="small"
                sx={{
                  height: "1.5rem",
                  "& .MuiChip-label": { fontSize: "0.75rem" },
                }}
              />
            );
          })}
        </Box>
      );
    }

    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return <span style={{ color: "rgb(148, 163, 184)" }}>{placeholder}</span>;
    }

    const option = options.find((opt) => opt.value === selected);
    return option?.label || selected;
  };

  return (
    <div className={`self-stretch ${className}`}>
      <FormControl fullWidth size="small" error={!!error} disabled={isSubmitting}>
        <Select
          {...restFieldOptions}
          {...restProps}
          key={keyProp}
          value={isMultiple ? (Array.isArray(value) ? value : []) : value || ""}
          onChange={handleChange}
          multiple={isMultiple}
          displayEmpty
          renderValue={renderValue}
          input={<OutlinedInput />}
          MenuProps={MenuProps}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(203, 213, 225)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(203, 213, 225)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-primary, #172733)",
            },
            "& .MuiSelect-select": {
              padding: "0.5rem 0.75rem",
              fontSize: "0.875rem",
              minHeight: "auto",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgb(248, 250, 252)",
              cursor: "not-allowed",
            },
            height: "2.5rem", // Fixed height to match text input
            borderRadius: "0.375rem",
            backgroundColor: "white",
            ...restProps.sx,
          }}>
          {options.map((option: SelectOption) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: "0.875rem",
                padding: "0.5rem 0.75rem",
                "&:hover": {
                  backgroundColor: "rgb(241 245 249)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(23, 39, 51, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(23, 39, 51, 0.12)",
                  },
                },
              }}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && (
        <FormHelperText
          error={!!error}
          sx={{ margin: "0.25rem 0.875rem" }} // 4px 14px in rem units
        >
          {error}
        </FormHelperText>
      )}
    </div>
  );
});

export default BaseSelectV2;
