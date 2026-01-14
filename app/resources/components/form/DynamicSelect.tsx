"use client";

import Select from "./Fields/Select";
import MultiSelect from "@resources/components/common/MultiSelect";
import { memo, useMemo } from "react";
import { Control, FieldValues, useController } from "react-hook-form";

interface DynamicSelectProps {
  options?: {
    options?: SelectOption<string>[];
    defaultOption?: SelectOption<string>;
    mode?: "single" | "multiple";
    placeholder?: string;
    [key: string]: unknown;
  };
  keyProp: string;
  control: Control<FieldValues>;
  name: string;
  [key: string]: unknown;
}

const DynamicSelect = memo(function DynamicSelect({
  options: fieldOptions = {},
  keyProp,
  ...restProps
}: DynamicSelectProps) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;
  const { onChange } = field;

  const { options: staticOptions = [], defaultOption, placeholder = "Select...", mode = "single" } = fieldOptions;

  const options = useMemo(() => {
    if (!staticOptions.length) return [];
    return defaultOption ? [defaultOption, ...staticOptions] : staticOptions;
  }, [defaultOption, staticOptions]);

  const isMultiple = mode === "multiple";

  // Convert options to the format expected by MultiSelect (string values)
  const multiSelectOptions = useMemo(
    () =>
      options.map((opt) => ({
        value: String(opt.value),
        label: opt.label,
      })),
    [options],
  );

  if (isMultiple) {
    // Ensure field.value is typed as an array of strings for multiple select
    const fieldValue = field.value as unknown;
    const multiValue = Array.isArray(fieldValue) ? fieldValue.map(String) : [];

    return (
      <MultiSelect
        options={multiSelectOptions}
        value={multiValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isSubmitting}
        error={invalid ? error?.message : undefined}
      />
    );
  }

  return (
    <Select
      keyProp={keyProp}
      value={field.value !== undefined ? (field.value as string | number) : null}
      onChange={onChange}
      options={{
        ...fieldOptions,
        options,
      }}
      error={invalid ? error?.message : undefined}
      isSubmitting={isSubmitting}
      placeholder={placeholder}
      {...restProps}
    />
  );
});

export default DynamicSelect;
