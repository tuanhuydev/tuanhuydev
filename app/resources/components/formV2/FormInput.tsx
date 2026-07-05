import { Input } from "../common/Input";
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

export enum InputType {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  TEXTAREA = "textarea",
}
export interface FormInputProps<TFieldValues extends FieldValues> {
  type: InputType;
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  className?: string;
  [key: string]: unknown;
}
export const FormInput = <TFieldValues extends FieldValues>({
  type,
  label,
  control,
  className,
  ...restProps
}: FormInputProps<TFieldValues>) => {
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
        <Input
          disabled={isDisabled}
          type={type}
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
