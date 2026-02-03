import { Label } from "../common/Label";
import { cn } from "@resources/utils/helper";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface FormRadioProps<TFieldValues extends FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: RadioOption[];
  className?: string;
  orientation?: "horizontal" | "vertical";
  [key: string]: unknown;
}

export const FormRadio = <TFieldValues extends FieldValues>({
  label,
  control,
  options,
  className,
  orientation = "vertical",
  ...restProps
}: FormRadioProps<TFieldValues>) => {
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 capitalize">
            {label}
          </label>
        )}
        <div
          className={cn(
            "space-y-2",
            orientation === "horizontal" && "flex flex-wrap gap-4 space-y-0",
            hasError && "border border-red-500 dark:border-red-500 rounded-md p-3",
          )}>
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-2">
              <input
                type="radio"
                id={`${field.name}-${option.value}`}
                value={option.value}
                checked={field.value === option.value}
                onChange={() => field.onChange(option.value)}
                disabled={isDisabled}
                className={cn(
                  "mt-0.5 h-4 w-4 cursor-pointer",
                  "border-slate-300 dark:border-slate-600",
                  "text-primary",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              />
              <div className="flex flex-col">
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className="cursor-pointer font-normal text-slate-700 dark:text-slate-300">
                  {option.label}
                </Label>
                {option.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{option.description}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldState.error?.message}</p>}
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
