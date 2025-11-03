"use client";

import { Box, Chip, FormControl, FormHelperText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useEffect, useState, memo } from "react";
import { useController } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface DynamicSelectV2Props {
  options?: {
    options?: SelectOption[];
    defaultOption?: SelectOption;
    mode?: "single" | "multiple";
    placeholder?: string;
    [key: string]: any;
  };
  keyProp: string;
  className?: string;
  control: any;
  name: string;
  [key: string]: any;
}

const DynamicSelectV2 = memo(function DynamicSelectV2({
  options: fieldOptions = {},
  keyProp,
  className = "w-full",
  ...restProps
}: DynamicSelectV2Props) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange } = field;

  const [options, setOptions] = useState<SelectOption[]>([]);
  const { options: staticOptions = [], defaultOption, placeholder = "Select..." } = fieldOptions;

  useEffect(() => {
    if (staticOptions.length) {
      const newDropdownOptions = defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
      setOptions(newDropdownOptions);
    }
  }, [defaultOption, staticOptions]);

  const isMultiple = fieldOptions.mode === "multiple";

  const handleChange = (event: any) => {
    const value = event.target.value;
    onChange(isMultiple ? (typeof value === "string" ? value.split(",") : value) : value);
  };

  const renderValue = (selected: any) => {
    if (isMultiple && Array.isArray(selected)) {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((val) => {
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
    <div className={`p-2 self-stretch ${className}`}>
      <FormControl fullWidth size="small" error={invalid} disabled={isSubmitting}>
        <Select
          key={keyProp}
          value={isMultiple ? (Array.isArray(field.value) ? field.value : []) : field.value || ""}
          onChange={handleChange}
          multiple={isMultiple}
          displayEmpty
          renderValue={renderValue}
          input={<OutlinedInput />}>
          {options.map((option: SelectOption) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {invalid && error && (
        <FormHelperText error={invalid} sx={{ margin: "0.25rem 0.875rem" }}>
          {error?.message}
        </FormHelperText>
      )}
    </div>
  );
});

export default DynamicSelectV2;
