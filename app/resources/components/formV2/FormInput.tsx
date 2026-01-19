import { Input } from "../common/Input";
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
  [key: string]: unknown;
}
export const FormInput = <TFieldValues extends FieldValues>({
  type,
  label,
  control,
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

    return (
      <div className="container">
        {label && <label className="text-sm text-slate-700 capitalize mb-1">{label}</label>}
        <Input disabled={isDisabled} type={type} {...field} {...restProps} />
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
