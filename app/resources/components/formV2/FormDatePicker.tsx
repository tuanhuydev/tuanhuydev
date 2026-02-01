import { Button } from "../common/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover";
import { Calendar } from "../common/calendar";
import { cn } from "@resources/utils/helper";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

export interface FormDatePickerProps<TFieldValues extends FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  className?: string;
  [key: string]: unknown;
}

export const FormDatePicker = <TFieldValues extends FieldValues>({
  label,
  control,
  placeholder = "Pick a date",
  className,
  ...restProps
}: FormDatePickerProps<TFieldValues>) => {
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={isDisabled}
              className={cn(
                "w-full justify-start text-left font-normal",
                !field.value && "text-muted-foreground",
                hasError && "border-red-500 dark:border-red-500",
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
          </PopoverContent>
        </Popover>
        {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldState.error?.message}</p>}
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
