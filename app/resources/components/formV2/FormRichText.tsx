import { MDXEditor } from "../common/MDXEditor";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

export interface FormInputProps<TFieldValues extends FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  [key: string]: unknown;
}
export const FormRichText = <TFieldValues extends FieldValues>({
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

    const handleChange = (value: string) => {
      field.onChange(value);
    };

    return (
      <div className="container">
        {label && <label className="text-sm text-slate-700 capitalize mb-2">{label}</label>}
        <MDXEditor value={field.value} disabled={isDisabled} onChange={handleChange} />
      </div>
    );
  };
  return <Controller control={control} render={render} {...restProps} />;
};
