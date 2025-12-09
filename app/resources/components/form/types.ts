// Type definitions for FormV2 components

// Common type for object with string keys and any values
export type ObjectType = { [key: string]: any };

export interface FormFieldConfig {
  id: string;
  type: "text" | "textarea" | "select" | "date" | "markdown" | "table";
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
  };
  gridSize?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  dependsOn?: string;
  conditionalRender?: (values: FormValues) => boolean;
}

export interface FormValues {
  [key: string]: any;
}

export interface FormValidation {
  [key: string]: string | undefined;
}

export interface DynamicFormProps {
  fields: FormFieldConfig[];
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void | Promise<void>;
  onValidate?: (values: FormValues) => FormValidation | Promise<FormValidation>;
  submitLabel?: string;
  resetLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  showReset?: boolean;
  validationMode?: "onChange" | "onBlur" | "onSubmit";
  className?: string;
  sx?: object;
}

export interface BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  type?: "text" | "email" | "password" | "number";
  multiline?: boolean;
  rows?: number;
  sx?: object;
}

export interface BaseSelectProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: Array<{ value: string; label: string }>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  multiple?: boolean;
  sx?: object;
}

export interface BaseDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  sx?: object;
}

export interface PerformanceMetrics {
  renderTime: number;
  validationTime: number;
  componentCount: number;
  reRenderCount: number;
}

export interface FormPerformanceHook {
  metrics: PerformanceMetrics;
  startTimer: (operation: string) => void;
  endTimer: (operation: string) => void;
  incrementRender: () => void;
  reset: () => void;
}
