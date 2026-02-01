import { Textarea } from "../common/Textarea";
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
      <div className={className || "w-full"}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">
            {label}
          </label>
        )}
        <Textarea
          disabled={isDisabled}
          className={hasError ? "border-red-500 dark:border-red-500" : ""}
          {...field}
          {...restProps}
        />
        {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldState.error?.message}</p>}
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
