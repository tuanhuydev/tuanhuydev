import { MultiSelect, MultiSelectOption } from "../common/MultiSelect";
import fieldStyles from "./FormField.module.css";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

export interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  options: MultiSelectOption[];
  className?: string;
  [key: string]: unknown;
}

export const FormMultiSelect = <TFieldValues extends FieldValues>({
  label,
  control,
  placeholder = "Select items...",
  options,
  className,
  ...restProps
}: FormMultiSelectProps<TFieldValues>) => {
  const render = ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<TFieldValues>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => {
    const isDisabled: boolean = formState.isSubmitting || fieldState.isValidating || !!field.disabled;

    return (
      <div className={className || fieldStyles.wrapper}>
        {label && <label className={fieldStyles.label}>{label}</label>}
        <MultiSelect
          disabled={isDisabled}
          options={options}
          value={field.value ?? []}
          onChange={field.onChange}
          placeholder={placeholder}
          error={fieldState.error?.message}
        />
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
