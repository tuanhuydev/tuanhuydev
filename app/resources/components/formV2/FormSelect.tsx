import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../common/Select";
import fieldStyles from "./FormField.module.css";
import clsx from "clsx";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps<TFieldValues extends FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  [key: string]: unknown;
}

export const FormSelect = <TFieldValues extends FieldValues>({
  label,
  control,
  placeholder = "Select an option",
  options,
  className,
  ...restProps
}: FormSelectProps<TFieldValues>) => {
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
    const hasError = !!fieldState.error;

    return (
      <div className={className || fieldStyles.wrapper}>
        {label && <label className={fieldStyles.label}>{label}</label>}
        <Select disabled={isDisabled} onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className={clsx(hasError && fieldStyles.fieldError)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {hasError && <p className={fieldStyles.error}>{fieldState.error?.message}</p>}
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
