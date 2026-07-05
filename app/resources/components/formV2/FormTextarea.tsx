import { Textarea } from "../common/Textarea";
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

export interface FormTextareaProps<TFieldValues extends FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  rows?: number;
  className?: string;
  [key: string]: unknown;
}

export const FormTextarea = <TFieldValues extends FieldValues>({
  label,
  control,
  className,
  ...restProps
}: FormTextareaProps<TFieldValues>) => {
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
        <Textarea
          disabled={isDisabled}
          className={clsx(hasError && fieldStyles.fieldError)}
          {...field}
          {...restProps}
        />
        {hasError && <p className={fieldStyles.error}>{fieldState.error?.message}</p>}
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
